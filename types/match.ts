// ============================================================
// FILE: types/match.ts
// MỤC ĐÍCH: Định nghĩa kiểu dữ liệu (TypeScript types) cho
//            thông tin trận đấu.
//
// KIẾN TRÚC DUAL API:
//   Website dùng 2 nguồn API:
//   1. TheSportsDB (miễn phí, data 2025-2026 hiện tại)
//   2. API-Football (miễn phí, data lịch sử 2022-2024)
//
//   Cả 2 API trả về format JSON khác nhau, nên cần 1 interface
//   chung (MatchEvent) để components không cần quan tâm data
//   đến từ API nào. Hàm "normalize" trong api.ts sẽ chuyển đổi
//   data từ mỗi API sang format MatchEvent thống nhất.
// ============================================================

/**
 * MatchEvent — Kiểu dữ liệu CHUẨN cho 1 trận đấu.
 *
 * Đây là "interface trung gian" — dù data đến từ TheSportsDB
 * hay API-Football, đều được chuyển về format này.
 *
 * Components (MatchCard, MatchList) chỉ biết đến MatchEvent,
 * không cần biết data đến từ API nào.
 *
 * Dấu "| null" nghĩa là trường đó có thể không có giá trị.
 */
export interface MatchEvent {
  // --- Thông tin cơ bản ---
  idEvent: string;                    // ID duy nhất của trận đấu
  strEvent: string;                   // Tên trận đấu, VD: "Vietnam vs Bangladesh"
  source: "thesportsdb" | "api-football"; // Nguồn data (để debug)

  // --- Thông tin giải đấu ---
  idLeague: string;                   // ID giải đấu
  strLeague: string;                  // Tên giải, VD: "World Cup Qualifying AFC"
  strLeagueBadge: string | null;      // Link ảnh logo giải đấu
  strSeason: string;                  // Mùa giải, VD: "2026"

  // --- Đội nhà (Home) ---
  idHomeTeam: string;                 // ID đội nhà
  strHomeTeam: string;                // Tên đội nhà, VD: "Vietnam"
  strHomeTeamBadge: string | null;    // Link ảnh logo đội nhà
  intHomeScore: string | null;        // Số bàn thắng đội nhà (null nếu chưa đá)

  // --- Đội khách (Away) ---
  idAwayTeam: string;                 // ID đội khách
  strAwayTeam: string;                // Tên đội khách, VD: "Bangladesh"
  strAwayTeamBadge: string | null;    // Link ảnh logo đội khách
  intAwayScore: string | null;        // Số bàn thắng đội khách (null nếu chưa đá)

  // --- Ngày giờ ---
  dateEvent: string;                  // Ngày thi đấu, VD: "2026-03-26"
  strTime: string;                    // Giờ UTC, VD: "12:00:00"
  strTimestamp: string;               // Timestamp đầy đủ, VD: "2026-03-26T12:00:00"

  // --- Địa điểm ---
  strVenue: string | null;            // Tên sân vận động
  strCountry: string | null;          // Quốc gia nơi thi đấu

  // --- Trạng thái ---
  strStatus: string;                  // "Not Started", "Match Finished", v.v.

  // --- Hình ảnh ---
  strThumb: string | null;            // Ảnh thumbnail trận đấu

  // --- Vòng đấu ---
  intRound: string | null;            // Vòng đấu
}

// ============================================================
// HẰNG SỐ TEAM ID
// ============================================================

/**
 * VIETNAM_TEAM_ID — ID đội tuyển Việt Nam trong từng API.
 *
 * Mỗi API có hệ thống ID riêng, nên cần 2 giá trị khác nhau.
 */
export const VIETNAM_TEAM_ID = "140161";          // TheSportsDB
export const VIETNAM_TEAM_ID_AF = "1542";         // API-Football

/**
 * MatchType — Phân loại trận đấu để hiển thị UI khác nhau.
 * - "past"     = trận đã kết thúc (có tỷ số)
 * - "upcoming" = trận sắp diễn ra (chưa có tỷ số)
 */
export type MatchType = "past" | "upcoming";
