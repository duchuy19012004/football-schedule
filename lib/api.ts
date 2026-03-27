// ============================================================
// FILE: lib/api.ts
// MỤC ĐÍCH: Chứa tất cả các hàm gọi API đến TheSportsDB
//            để lấy dữ liệu trận đấu của ĐT Việt Nam.
//
// KIẾN TRÚC NEXT.JS (giải thích):
//   - Trong Next.js App Router, code ở thư mục "lib/" là code
//     chạy trên SERVER (không phải trình duyệt).
//   - Khi page.tsx gọi hàm từ file này, server sẽ fetch data
//     từ API, xử lý xong rồi mới gửi HTML đến trình duyệt.
//   - Lợi ích: nhanh hơn, SEO tốt hơn, bảo mật hơn.
//
// API SỬ DỤNG: TheSportsDB (https://www.thesportsdb.com)
//   - Miễn phí, không cần đăng ký
//   - API key mặc định: "3" (free tier)
//   - Vietnam team ID: 140161
// ============================================================

import axios from "axios";
import { MatchEvent, VIETNAM_TEAM_ID } from "@/types/match";

// ============================================================
// CẤU HÌNH (CONSTANTS)
// ============================================================

/**
 * BASE_URL — Đường dẫn gốc của TheSportsDB API.
 * Số "3" ở cuối là API key miễn phí (public key).
 */
const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";

/**
 * Danh sách ID các giải đấu mà ĐT Việt Nam tham gia.
 * Lấy từ API searchteams.php (đã kiểm tra).
 *
 * VD: Vòng loại World Cup AFC (id: 5513), Giao hữu quốc tế (id: 4562)...
 */
const VIETNAM_LEAGUE_IDS = [
  "5513",   // World Cup Qualifying AFC (Vòng loại World Cup khu vực châu Á)
  "4562",   // International Friendlies (Giao hữu quốc tế)
  "5521",   // AFC Asian Cup Qualifying (Vòng loại Asian Cup)
];

// ============================================================
// HÀM GỌI API
// ============================================================

/**
 * getPastMatches — Lấy danh sách các trận ĐÃ ĐÁ gần nhất.
 *
 * CÁCH HOẠT ĐỘNG:
 *   1. Gọi API endpoint "eventslast.php" với team ID = 140161
 *   2. API trả về array JSON chứa 5 trận gần nhất đã kết thúc
 *   3. Hàm trả về array MatchEvent[] đã được type-safe
 *
 * API ENDPOINT: GET /eventslast.php?id=140161
 *
 * @returns Promise<MatchEvent[]> — Mảng các trận đấu đã qua
 *
 * LƯU Ý: "async/await" là cách viết code bất đồng bộ trong JS.
 *   Hàm async luôn trả về Promise. "await" = đợi kết quả trả về.
 */
export async function getPastMatches(): Promise<MatchEvent[]> {
  try {
    // Gọi API bằng axios — tương tự fetch() nhưng tiện hơn
    // axios.get() tự chuyển JSON → JavaScript object
    const response = await axios.get(
      `${BASE_URL}/eventslast.php?id=${VIETNAM_TEAM_ID}`
    );

    // API trả về: { results: [...] } hoặc { results: null }
    // Dấu "?." (optional chaining) = nếu null thì không bị lỗi
    // Dấu "|| []" = nếu null thì trả mảng rỗng []
    const matches: MatchEvent[] = response.data?.results || [];

    return matches;
  } catch (error) {
    // Nếu API lỗi (mất mạng, server down...), in lỗi ra console
    // và trả mảng rỗng để UI không bị crash
    console.error("❌ Lỗi khi lấy trận đã qua:", error);
    return [];
  }
}

/**
 * getUpcomingMatches — Lấy danh sách các trận SẮP DIỄN RA.
 *
 * CÁCH HOẠT ĐỘNG:
 *   1. Gọi API "eventsnext.php" cho TỪNG GIẢI ĐẤU Việt Nam tham gia
 *   2. Từ mỗi giải, lọc ra trận nào có ĐT Việt Nam (check team ID)
 *   3. Ghép tất cả lại, sắp xếp theo ngày gần nhất
 *
 * TẠI SAO KHÔNG DÙNG eventsnext.php?id=TEAM_ID?
 *   → Vì API free tier trả về sai data khi query theo team ID
 *     cho eventsnext. Nên phải query theo league rồi filter.
 *
 * @returns Promise<MatchEvent[]> — Mảng các trận sắp diễn ra
 */
export async function getUpcomingMatches(): Promise<MatchEvent[]> {
  try {
    // Tạo mảng các Promise — mỗi Promise gọi API cho 1 giải đấu
    // Promise.allSettled() gọi tất cả cùng lúc (song song), nhanh hơn
    const promises = VIETNAM_LEAGUE_IDS.map((leagueId) =>
      axios.get(`${BASE_URL}/eventsnext.php?id=${leagueId}`)
    );

    // Đợi TẤT CẢ các API call hoàn thành
    // "allSettled" = không bị crash nếu 1 trong các call bị lỗi
    const results = await Promise.allSettled(promises);

    // Mảng chứa tất cả các trận sắp tới
    const allMatches: MatchEvent[] = [];

    // Duyệt qua kết quả của từng giải đấu
    for (const result of results) {
      // Chỉ xử lý những call thành công (status = "fulfilled")
      if (result.status === "fulfilled") {
        const events: MatchEvent[] = result.value.data?.events || [];

        // Lọc: chỉ lấy trận nào có ĐT Việt Nam (nhà HOẶC khách)
        const vietnamMatches = events.filter(
          (event) =>
            event.idHomeTeam === VIETNAM_TEAM_ID ||
            event.idAwayTeam === VIETNAM_TEAM_ID
        );

        // Thêm vào mảng tổng
        allMatches.push(...vietnamMatches);
      }
    }

    // Sắp xếp theo ngày: trận gần nhất lên trước
    // localeCompare so sánh 2 chuỗi ngày (vì format YYYY-MM-DD nên so sánh string OK)
    allMatches.sort((a, b) =>
      a.dateEvent.localeCompare(b.dateEvent)
    );

    return allMatches;
  } catch (error) {
    console.error("❌ Lỗi khi lấy trận sắp tới:", error);
    return [];
  }
}

/**
 * getTeamInfo — Lấy thông tin ĐT Việt Nam (logo, mô tả, sân nhà...).
 *
 * CÁCH HOẠT ĐỘNG:
 *   Gọi API "lookupteam.php" với team ID = 140161
 *   Trả về object chứa đầy đủ thông tin đội bóng.
 *
 * @returns Thông tin đội bóng hoặc null nếu lỗi
 */
export async function getTeamInfo() {
  try {
    const response = await axios.get(
      `${BASE_URL}/lookupteam.php?id=${VIETNAM_TEAM_ID}`
    );
    // API trả về: { teams: [{...}] }
    // Lấy phần tử đầu tiên ([0]) vì chỉ có 1 đội
    return response.data?.teams?.[0] || null;
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin đội:", error);
    return null;
  }
}
