// ============================================================
// FILE: types/match.ts
// MỤC ĐÍCH: Định nghĩa kiểu dữ liệu (TypeScript types) cho
//            thông tin trận đấu lấy từ TheSportsDB API.
//
// GIẢI THÍCH: TypeScript yêu cầu mọi dữ liệu phải có "kiểu"
//   (type) rõ ràng. File này mô tả cấu trúc dữ liệu 1 trận đấu
//   bao gồm những trường nào, kiểu gì (string, number, null...).
//   Tất cả các file khác sẽ import types từ đây.
// ============================================================

/**
 * MatchEvent — Kiểu dữ liệu cho 1 trận đấu từ TheSportsDB.
 *
 * Mỗi trường (field) tương ứng với 1 thuộc tính trong JSON
 * mà API trả về. VD: "strEvent" chứa tên trận đấu.
 *
 * Dấu "| null" nghĩa là trường đó có thể không có giá trị (null).
 */
export interface MatchEvent {
  // --- Thông tin cơ bản ---
  idEvent: string;                    // ID duy nhất của trận đấu
  strEvent: string;                   // Tên trận đấu, VD: "Vietnam vs Bangladesh"
  strSport: string;                   // Môn thể thao, luôn là "Soccer"

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
  strTimeLocal: string | null;        // Giờ địa phương (nếu có)

  // --- Địa điểm ---
  strVenue: string | null;            // Tên sân vận động
  strCountry: string | null;          // Quốc gia nơi thi đấu

  // --- Trạng thái ---
  strStatus: string;                  // Trạng thái: "Not Started", "Match Finished", v.v.
  strPostponed: string;               // "yes" hoặc "no" — trận có bị hoãn không

  // --- Hình ảnh (tùy chọn) ---
  strThumb: string | null;            // Ảnh thumbnail trận đấu
  strPoster: string | null;           // Ảnh poster trận đấu

  // --- Tỷ số chi tiết ---
  intRound: string | null;            // Vòng đấu
  strResult: string | null;           // Kết quả tóm tắt
}

/**
 * VIETNAM_TEAM_ID — ID của đội tuyển Việt Nam trong TheSportsDB.
 * Dùng để gọi API lấy data: eventslast.php?id=140161
 */
export const VIETNAM_TEAM_ID = "140161";

/**
 * MatchType — Phân loại trận đấu để hiển thị UI khác nhau.
 * - "past"     = trận đã kết thúc (có tỷ số)
 * - "upcoming" = trận sắp diễn ra (chưa có tỷ số)
 */
export type MatchType = "past" | "upcoming";
