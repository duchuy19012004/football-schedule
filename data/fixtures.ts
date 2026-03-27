// ============================================================
// FILE: data/fixtures.ts
// MỤC ĐÍCH: Dữ liệu trận đấu được cập nhật thủ công từ
//            web scraping (Google, Transfermarkt, VFF).
//
// TẠI SAO CẦN FILE NÀY:
//   Cả 2 API miễn phí (TheSportsDB, API-Football) đều có
//   giới hạn nghiêm trọng cho ĐT Việt Nam:
//   - TheSportsDB: eventsnext trả sai data (Bolton Wanderers!)
//   - API-Football free: chỉ có data 2022-2024
//
//   File này đóng vai trò "nguồn chân lý" (source of truth)
//   cho các trận đấu quan trọng sắp tới. Data được scrape
//   từ Google Sports Panel và các nguồn tin bóng đá.
//
// CÁCH CẬP NHẬT:
//   Khi VFF hoặc AFC công bố lịch mới, cập nhật file này:
//   1. Thêm trận mới vào array UPCOMING_FIXTURES
//   2. Cập nhật tỷ số khi trận kết thúc (chuyển sang PAST_RESULTS)
//   3. Commit & push lên GitHub
//
// LƯU Ý: Tất cả thời gian trong UTC (cộng 7 để ra giờ VN)
// ============================================================

import { MatchEvent } from "@/types/match";

// Logo ĐT Việt Nam từ TheSportsDB (dùng chung cho tất cả trận)
const VN_BADGE = "https://r2.thesportsdb.com/images/media/team/badge/i18iu41597944056.png";
const VN_TEAM_ID = "140161"; // TheSportsDB ID — MatchCard dùng để highlight vàng

/**
 * PAST_RESULTS — Kết quả trận đấu mà API chưa/không cập nhật.
 *
 * Dùng để "override" data từ TheSportsDB khi API trả score = null
 * nhưng thực tế trận đã đá xong.
 *
 * Format: mỗi object là 1 MatchEvent hoàn chỉnh.
 */
export const PAST_RESULTS: MatchEvent[] = [
  {
    idEvent: "manual-20260326",
    strEvent: "Vietnam vs Bangladesh",
    source: "thesportsdb",  // giữ source gốc để UI nhất quán

    idLeague: "4562",
    strLeague: "Giao hữu quốc tế",
    strLeagueBadge: "https://r2.thesportsdb.com/images/media/league/badge/pdnktx1648659448.png",
    strSeason: "2026",

    idHomeTeam: VN_TEAM_ID,
    strHomeTeam: "Vietnam",
    strHomeTeamBadge: VN_BADGE,
    intHomeScore: "3",       // ← Tỷ số thực tế từ Google

    idAwayTeam: "140137",
    strAwayTeam: "Bangladesh",
    strAwayTeamBadge: "https://r2.thesportsdb.com/images/media/team/badge/ga08v71597850819.png",
    intAwayScore: "0",       // ← Tỷ số thực tế từ Google

    dateEvent: "2026-03-26",
    strTime: "12:00:00",     // UTC (= 19:00 giờ VN)
    strTimestamp: "2026-03-26T12:00:00",

    strVenue: "Sân vận động Quốc gia Mỹ Đình",
    strCountry: "Vietnam",
    strStatus: "Match Finished",
    strThumb: null,
    intRound: null,
  },
];

/**
 * UPCOMING_FIXTURES — Lịch thi đấu sắp tới.
 *
 * Data scrape từ Google Sports Panel (27/03/2026).
 * Cần cập nhật khi có lịch mới hoặc khi trận kết thúc.
 */
export const UPCOMING_FIXTURES: MatchEvent[] = [
  {
    idEvent: "manual-20260331",
    strEvent: "Vietnam vs Malaysia",
    source: "thesportsdb",

    idLeague: "5521",
    strLeague: "AFC Asian Cup Qualifiers",
    strLeagueBadge: null,
    strSeason: "2026",

    idHomeTeam: VN_TEAM_ID,
    strHomeTeam: "Vietnam",
    strHomeTeamBadge: VN_BADGE,
    intHomeScore: null,

    idAwayTeam: "140155",
    strAwayTeam: "Malaysia",
    strAwayTeamBadge: "https://r2.thesportsdb.com/images/media/team/badge/4l8bw51597941128.png",
    intAwayScore: null,

    dateEvent: "2026-03-31",
    strTime: "12:00:00",     // UTC (= 19:00 giờ VN)
    strTimestamp: "2026-03-31T12:00:00",

    strVenue: "Sân vận động Quốc gia Mỹ Đình",
    strCountry: "Vietnam",
    strStatus: "Not Started",
    strThumb: null,
    intRound: "6",
  },
  {
    idEvent: "manual-20260724",
    strEvent: "Timor Leste vs Vietnam",
    source: "thesportsdb",

    idLeague: "4574",
    strLeague: "ASEAN Cup 2026",
    strLeagueBadge: null,
    strSeason: "2026",

    idHomeTeam: "140176",
    strHomeTeam: "Timor Leste",
    strHomeTeamBadge: null,
    intHomeScore: null,

    idAwayTeam: VN_TEAM_ID,
    strAwayTeam: "Vietnam",
    strAwayTeamBadge: VN_BADGE,
    intAwayScore: null,

    dateEvent: "2026-07-24",
    strTime: "11:00:00",
    strTimestamp: "2026-07-24T11:00:00",

    strVenue: null,
    strCountry: null,
    strStatus: "Not Started",
    strThumb: null,
    intRound: "1",
  },
  {
    idEvent: "manual-20260731",
    strEvent: "Vietnam vs Singapore",
    source: "thesportsdb",

    idLeague: "4574",
    strLeague: "ASEAN Cup 2026",
    strLeagueBadge: null,
    strSeason: "2026",

    idHomeTeam: VN_TEAM_ID,
    strHomeTeam: "Vietnam",
    strHomeTeamBadge: VN_BADGE,
    intHomeScore: null,

    idAwayTeam: "140172",
    strAwayTeam: "Singapore",
    strAwayTeamBadge: null,
    intAwayScore: null,

    dateEvent: "2026-07-31",
    strTime: "13:00:00",
    strTimestamp: "2026-07-31T13:00:00",

    strVenue: null,
    strCountry: "Vietnam",
    strStatus: "Not Started",
    strThumb: null,
    intRound: "2",
  },
  {
    idEvent: "manual-20260803",
    strEvent: "Indonesia vs Vietnam",
    source: "thesportsdb",

    idLeague: "4574",
    strLeague: "ASEAN Cup 2026",
    strLeagueBadge: null,
    strSeason: "2026",

    idHomeTeam: "140147",
    strHomeTeam: "Indonesia",
    strHomeTeamBadge: "https://r2.thesportsdb.com/images/media/team/badge/6m3dpr1597939498.png",
    intHomeScore: null,

    idAwayTeam: VN_TEAM_ID,
    strAwayTeam: "Vietnam",
    strAwayTeamBadge: VN_BADGE,
    intAwayScore: null,

    dateEvent: "2026-08-03",
    strTime: "12:00:00",
    strTimestamp: "2026-08-03T12:00:00",

    strVenue: null,
    strCountry: "Indonesia",
    strStatus: "Not Started",
    strThumb: null,
    intRound: "3",
  },
  {
    idEvent: "manual-20260810",
    strEvent: "Vietnam vs Myanmar",
    source: "thesportsdb",

    idLeague: "4574",
    strLeague: "ASEAN Cup 2026",
    strLeagueBadge: null,
    strSeason: "2026",

    idHomeTeam: VN_TEAM_ID,
    strHomeTeam: "Vietnam",
    strHomeTeamBadge: VN_BADGE,
    intHomeScore: null,

    idAwayTeam: "140158",
    strAwayTeam: "Myanmar",
    strAwayTeamBadge: null,
    intAwayScore: null,

    dateEvent: "2026-08-10",
    strTime: "13:00:00",
    strTimestamp: "2026-08-10T13:00:00",

    strVenue: null,
    strCountry: "Vietnam",
    strStatus: "Not Started",
    strThumb: null,
    intRound: "4",
  },
];
