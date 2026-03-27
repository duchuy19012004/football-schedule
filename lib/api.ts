// ============================================================
// FILE: lib/api.ts
// MỤC ĐÍCH: Chứa tất cả các hàm gọi API để lấy dữ liệu
//            trận đấu của ĐT Việt Nam.
//
// KIẾN TRÚC DUAL API:
//   Website sử dụng 2 nguồn dữ liệu MIỄN PHÍ:
//
//   ┌─────────────────────┐
//   │  TheSportsDB (chính)│ → Data hiện tại (2025-2026)
//   │  Không cần API key  │ → Trận sắp tới + kết quả gần đây
//   │  Free, unlimited    │ → Cập nhật tỷ số chậm 1-2 ngày
//   └────────┬────────────┘
//            │
//   ┌────────▼────────────┐
//   │  API-Football (phụ) │ → Data lịch sử (2022-2024)
//   │  Cần API key        │ → Bổ sung thêm trận đấu cũ
//   │  Free 100 req/ngày  │ → Tỷ số chính xác, real-time
//   └─────────────────────┘
//
//   Cả 2 API trả về format JSON KHÁC NHAU.
//   Hàm "normalize" chuyển đổi về format MatchEvent chung.
//
// CÁCH HOẠT ĐỘNG:
//   1. getPastMatches() → gọi TheSportsDB + API-Football
//      → ghép kết quả + loại trùng → sắp xếp theo ngày
//   2. getUpcomingMatches() → chỉ TheSportsDB (API-Football
//      free tier không có data 2025-2026)
//   3. getTeamInfo() → TheSportsDB team details
// ============================================================

import axios from "axios";
import { MatchEvent, VIETNAM_TEAM_ID, VIETNAM_TEAM_ID_AF } from "@/types/match";
import { PAST_RESULTS, UPCOMING_FIXTURES, VN_BADGE } from "@/data/fixtures";

// ============================================================
// CẤU HÌNH THESPORTSDB
// ============================================================

/**
 * BASE_URL — Đường dẫn gốc TheSportsDB API.
 * Số "3" = API key miễn phí (public key).
 */
const TSDB_BASE = "https://www.thesportsdb.com/api/v1/json/3";

/**
 * Danh sách ID giải đấu mà ĐT VN tham gia (TheSportsDB).
 * Dùng cho getUpcomingMatches() vì eventsnext?id=TEAM_ID
 * trả sai data trên free tier.
 */
const VIETNAM_LEAGUE_IDS = [
  "5513",   // World Cup Qualifying AFC
  "4562",   // International Friendlies (Giao hữu quốc tế)
  "5521",   // AFC Asian Cup Qualifying
  "4574",   // ASEAN Championship (AFF Cup)
  "5072",   // AFF Mitsubishi Electric Cup
];

// ============================================================
// CẤU HÌNH API-FOOTBALL
// ============================================================

/**
 * AF_BASE — Đường dẫn gốc API-Football v3.
 * Cần header "x-apisports-key" để xác thực.
 * API key lấy từ biến môi trường (.env.local).
 */
const AF_BASE = "https://v3.football.api-sports.io";

/**
 * afHeaders() — Tạo headers cho API-Football requests.
 * Đọc API key từ process.env (biến môi trường).
 *
 * process.env.API_FOOTBALL_KEY = giá trị trong file .env.local
 * Nếu không có key → trả object rỗng (skip API-Football)
 */
function afHeaders(): Record<string, string> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return {};
  return { "x-apisports-key": key };
}

/**
 * Seasons để query API-Football (free tier chỉ có 2022-2024).
 * Query nhiều seasons để lấy nhiều trận hơn.
 */
const AF_SEASONS = [2024, 2023];

// ============================================================
// HÀM NORMALIZE — Chuyển đổi data về format chung
// ============================================================

/**
 * normalizeFromTSDB — Chuyển data từ TheSportsDB sang MatchEvent.
 *
 * TheSportsDB trả JSON dạng "flat" (1 cấp):
 *   { idEvent: "123", strHomeTeam: "Vietnam", intHomeScore: "2", ... }
 *
 * Format này gần giống MatchEvent nên chỉ cần thêm field "source".
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeFromTSDB(raw: any): MatchEvent {
  return {
    idEvent: raw.idEvent,
    strEvent: raw.strEvent || `${raw.strHomeTeam} vs ${raw.strAwayTeam}`,
    source: "thesportsdb",

    idLeague: raw.idLeague,
    strLeague: raw.strLeague,
    strLeagueBadge: raw.strLeagueBadge || null,
    strSeason: raw.strSeason,

    idHomeTeam: raw.idHomeTeam,
    strHomeTeam: raw.strHomeTeam,
    strHomeTeamBadge: raw.idHomeTeam === VIETNAM_TEAM_ID
      ? VN_BADGE
      : (raw.strHomeTeamBadge || null),
    intHomeScore: raw.intHomeScore ?? null,

    idAwayTeam: raw.idAwayTeam,
    strAwayTeam: raw.strAwayTeam,
    strAwayTeamBadge: raw.idAwayTeam === VIETNAM_TEAM_ID
      ? VN_BADGE
      : (raw.strAwayTeamBadge || null),
    intAwayScore: raw.intAwayScore ?? null,

    dateEvent: raw.dateEvent,
    strTime: raw.strTime || "00:00:00",
    strTimestamp: raw.strTimestamp || `${raw.dateEvent}T${raw.strTime || "00:00:00"}`,

    strVenue: raw.strVenue || null,
    strCountry: raw.strCountry || null,

    strStatus: raw.strStatus || "Not Started",
    strThumb: raw.strThumb || null,
    intRound: raw.intRound || null,
  };
}

/**
 * normalizeFromAF — Chuyển data từ API-Football sang MatchEvent.
 *
 * API-Football trả JSON dạng "nested" (nhiều cấp):
 *   {
 *     fixture: { id: 123, date: "2024-03-26T12:00:00+00:00", venue: {...} },
 *     league: { id: 4, name: "Friendlies", logo: "..." },
 *     teams: { home: { id: 1542, name: "Vietnam", logo: "..." }, away: {...} },
 *     goals: { home: 2, away: 1 },
 *   }
 *
 * Cần "flatten" (làm phẳng) về format MatchEvent.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeFromAF(raw: any): MatchEvent {
  // Tách timestamp thành date + time
  // VD: "2024-03-26T12:00:00+00:00" → date="2024-03-26", time="12:00:00"
  const dateStr = raw.fixture?.date || "";
  const dateObj = new Date(dateStr);
  const date = dateStr.substring(0, 10); // "2024-03-26"
  const time = dateObj.toISOString().substring(11, 19); // "12:00:00"

  // Map trạng thái: API-Football dùng mã ngắn, ta chuyển sang text
  const statusMap: Record<string, string> = {
    NS: "Not Started",     // Not Started
    "1H": "1st Half",      // Hiệp 1
    HT: "Half Time",       // Giữa hiệp
    "2H": "2nd Half",      // Hiệp 2
    FT: "Match Finished",  // Kết thúc
    AET: "After Extra Time",
    PEN: "Penalty",
    PST: "Postponed",      // Hoãn
    CANC: "Cancelled",     // Hủy
    TBD: "TBD",            // Chưa xác định
  };

    // Check if home team is Vietnam (either AF ID or TSDB ID)
    const isHomeVietnam = raw.teams?.home?.id === Number(VIETNAM_TEAM_ID_AF)
      ? VIETNAM_TEAM_ID
      : String(raw.teams?.home?.id);
    const isAwayVietnam = raw.teams?.away?.id === Number(VIETNAM_TEAM_ID_AF)
      ? VIETNAM_TEAM_ID
      : String(raw.teams?.away?.id);

    return {
    idEvent: `af-${raw.fixture?.id}`, // Prefix "af-" để phân biệt với TheSportsDB
    strEvent: `${raw.teams?.home?.name} vs ${raw.teams?.away?.name}`,
    source: "api-football",

    idLeague: String(raw.league?.id || ""),
    strLeague: raw.league?.name || "Unknown League",
    strLeagueBadge: raw.league?.logo || null,
    strSeason: String(raw.league?.season || ""),

    // ⚠️ API-Football dùng ID riêng, cần convert sang TheSportsDB ID
    // Dùng VIETNAM_TEAM_ID cho đội VN dù data từ AF (để MatchCard nhận diện)
    idHomeTeam: raw.teams?.home?.id === Number(VIETNAM_TEAM_ID_AF)
      ? VIETNAM_TEAM_ID
      : String(raw.teams?.home?.id),
    strHomeTeam: raw.teams?.home?.name || "Unknown",
    strHomeTeamBadge: isHomeVietnam === VIETNAM_TEAM_ID
      ? VN_BADGE
      : (raw.teams?.home?.logo || null),
    intHomeScore: raw.goals?.home != null ? String(raw.goals.home) : null,

    idAwayTeam: raw.teams?.away?.id === Number(VIETNAM_TEAM_ID_AF)
      ? VIETNAM_TEAM_ID
      : String(raw.teams?.away?.id),
    strAwayTeam: raw.teams?.away?.name || "Unknown",
    strAwayTeamBadge: isAwayVietnam === VIETNAM_TEAM_ID
      ? VN_BADGE
      : (raw.teams?.away?.logo || null),
    intAwayScore: raw.goals?.away != null ? String(raw.goals.away) : null,

    dateEvent: date,
    strTime: time,
    strTimestamp: dateStr,

    strVenue: raw.fixture?.venue?.name || null,
    strCountry: raw.fixture?.venue?.city || null,

    strStatus: statusMap[raw.fixture?.status?.short] || raw.fixture?.status?.long || "Unknown",
    strThumb: null,
    intRound: raw.league?.round || null,
  };
}

// ============================================================
// HÀM GỌI API — PAST MATCHES
// ============================================================

/**
 * getPastMatches — Lấy danh sách trận ĐÃ ĐÁ.
 *
 * CHIẾN LƯỢC (3 nguồn, ưu tiên giảm dần):
 *   1. PAST_RESULTS (data/fixtures.ts) — data thủ công, ĐỘ CHÍNH XÁC CAO NHẤT
 *   2. TheSportsDB: eventslast (5 trận gần nhất, có thể chưa có tỷ số)
 *   3. API-Football: fixtures (data cũ 2022-2024)
 *
 *   PAST_RESULTS sẽ OVERRIDE data từ API nếu cùng trận (cùng ngày).
 *   VD: API trả VN vs Bangladesh score=null → PAST_RESULTS override thành 3-0.
 *
 * @returns Promise<MatchEvent[]> — Mảng trận đấu đã qua
 */
export async function getPastMatches(): Promise<MatchEvent[]> {
  // --- NGUỒN 1 (ưu tiên CAO nhất): Data thủ công ---
  // PAST_RESULTS chứa tỷ số chính xác, scrape từ Google
  const allMatches: MatchEvent[] = [...PAST_RESULTS];

  // Tạo Set các key từ manual data để loại trùng sau
  const manualKeys = new Set(
    PAST_RESULTS.map((m) => `${m.strHomeTeam}-${m.strAwayTeam}-${m.dateEvent}`)
  );

  // --- NGUỒN 2: TheSportsDB ---
  try {
    const tsdbRes = await axios.get(
      `${TSDB_BASE}/eventslast.php?id=${VIETNAM_TEAM_ID}`
    );
    const tsdbMatches = tsdbRes.data?.results || [];
    // Chỉ thêm trận KHÔNG trùng với manual data
    for (const raw of tsdbMatches) {
      const m = normalizeFromTSDB(raw);
      const key = `${m.strHomeTeam}-${m.strAwayTeam}-${m.dateEvent}`;
      if (!manualKeys.has(key)) {
        allMatches.push(m);
        manualKeys.add(key);
      }
    }
  } catch (error) {
    console.error("❌ TheSportsDB (past) lỗi:", error);
  }

  // --- NGUỒN 3: API-Football (nếu có API key) ---
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (apiKey) {
    try {
      const promises = AF_SEASONS.map((season) =>
        axios.get(`${AF_BASE}/fixtures`, {
          headers: afHeaders(),
          params: { team: VIETNAM_TEAM_ID_AF, season, status: "FT" },
        })
      );

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result.status === "fulfilled") {
          const fixtures = result.value.data?.response || [];
          for (const raw of fixtures) {
            const m = normalizeFromAF(raw);
            const key = `${m.strHomeTeam}-${m.strAwayTeam}-${m.dateEvent}`;
            if (!manualKeys.has(key)) {
              allMatches.push(m);
              manualKeys.add(key);
            }
          }
        }
      }
    } catch (error) {
      console.error("❌ API-Football (past) lỗi:", error);
    }
  }

  // --- Sắp xếp: trận mới nhất lên trước ---
  allMatches.sort((a, b) => b.dateEvent.localeCompare(a.dateEvent));

  // Giới hạn 15 trận gần nhất
  return allMatches.slice(0, 15);
}

// ============================================================
// HÀM GỌI API — UPCOMING MATCHES
// ============================================================

/**
 * getUpcomingMatches — Lấy danh sách trận SẮP DIỄN RA.
 *
 * CHIẾN LƯỢC (2 nguồn):
 *   1. UPCOMING_FIXTURES (data/fixtures.ts) — data thủ công, CHÍNH XÁC
 *   2. TheSportsDB eventsnext — bổ sung nếu API có data mới
 *
 *   Ưu tiên data thủ công vì TheSportsDB eventsnext
 *   bị bug trả sai data cho team VN.
 */
export async function getUpcomingMatches(): Promise<MatchEvent[]> {
  // --- NGUỒN 1 (chính): Data thủ công ---
  // Lọc chỉ lấy trận CHƯA diễn ra (dateEvent > today)
  const today = new Date().toISOString().substring(0, 10);
  const allMatches: MatchEvent[] = UPCOMING_FIXTURES.filter(
    (m) => m.dateEvent >= today
  );

  const manualKeys = new Set(
    allMatches.map((m) => `${m.strHomeTeam}-${m.strAwayTeam}-${m.dateEvent}`)
  );

  // --- NGUỒN 2 (bổ sung): TheSportsDB ---
  try {
    const promises = VIETNAM_LEAGUE_IDS.map((leagueId) =>
      axios.get(`${TSDB_BASE}/eventsnext.php?id=${leagueId}`)
    );

    const results = await Promise.allSettled(promises);

    for (const result of results) {
      if (result.status === "fulfilled") {
        const events = result.value.data?.events || [];
        const vietnamMatches = events.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (event: any) =>
            event.idHomeTeam === VIETNAM_TEAM_ID ||
            event.idAwayTeam === VIETNAM_TEAM_ID
        );
        for (const raw of vietnamMatches) {
          const m = normalizeFromTSDB(raw);
          const key = `${m.strHomeTeam}-${m.strAwayTeam}-${m.dateEvent}`;
          if (!manualKeys.has(key)) {
            allMatches.push(m);
            manualKeys.add(key);
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ TheSportsDB (upcoming) lỗi:", error);
  }

  // Sắp xếp: trận gần nhất lên trước
  allMatches.sort((a, b) => a.dateEvent.localeCompare(b.dateEvent));

  return allMatches;
}

// ============================================================
// HÀM GỌI API — TEAM INFO
// ============================================================

/**
 * getTeamInfo — Lấy thông tin ĐT Việt Nam (logo, mô tả...).
 * Dùng TheSportsDB lookupteam endpoint.
 */
export async function getTeamInfo() {
  try {
    const response = await axios.get(
      `${TSDB_BASE}/lookupteam.php?id=${VIETNAM_TEAM_ID}`
    );
    return response.data?.teams?.[0] || null;
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin đội:", error);
    return null;
  }
}
