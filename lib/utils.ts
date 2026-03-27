// ============================================================
// FILE: lib/utils.ts
// MỤC ĐÍCH: Các hàm tiện ích (utility functions) dùng chung
//            trong toàn bộ project. Chủ yếu là xử lý ngày giờ.
//
// GIẢI THÍCH: TheSportsDB trả giờ UTC (giờ quốc tế).
//   Việt Nam ở múi giờ UTC+7, nên cần cộng thêm 7 tiếng
//   để hiển thị đúng giờ Việt Nam.
//   VD: API trả "12:00 UTC" → hiển thị "19:00" giờ VN.
// ============================================================

import dayjs from "dayjs";
// Plugin "utc" cho phép dayjs xử lý giờ UTC
import utc from "dayjs/plugin/utc";
// Plugin "timezone" cho phép chuyển đổi sang múi giờ khác
import timezone from "dayjs/plugin/timezone";

// Kích hoạt (enable) 2 plugins cho dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

// Múi giờ Việt Nam — dùng tên chuẩn quốc tế IANA
const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

/**
 * formatMatchDate — Chuyển đổi ngày giờ UTC sang giờ Việt Nam.
 *
 * @param dateStr - Ngày từ API, VD: "2026-03-26"
 * @param timeStr - Giờ UTC từ API, VD: "12:00:00"
 * @returns Object chứa ngày và giờ đã format theo giờ VN
 *
 * VÍ DỤ:
 *   formatMatchDate("2026-03-26", "12:00:00")
 *   → { date: "26/03/2026", time: "19:00", dayOfWeek: "Thứ Năm", full: "19:00 - Thứ Năm, 26/03/2026" }
 */
export function formatMatchDate(dateStr: string, timeStr: string) {
  // Bước 1: Ghép ngày + giờ thành timestamp UTC
  // VD: "2026-03-26" + "12:00:00" → "2026-03-26T12:00:00Z"
  const utcDateTime = dayjs.utc(`${dateStr}T${timeStr}`);

  // Bước 2: Chuyển sang múi giờ Việt Nam (UTC+7)
  const vnDateTime = utcDateTime.tz(VIETNAM_TIMEZONE);

  // Bước 3: Lấy tên thứ trong tuần bằng tiếng Việt
  const dayNames = [
    "Chủ Nhật",   // 0 = Sunday
    "Thứ Hai",    // 1 = Monday
    "Thứ Ba",     // 2 = Tuesday
    "Thứ Tư",     // 3 = Wednesday
    "Thứ Năm",    // 4 = Thursday
    "Thứ Sáu",    // 5 = Friday
    "Thứ Bảy",    // 6 = Saturday
  ];
  const dayOfWeek = dayNames[vnDateTime.day()];

  // Bước 4: Format ngày giờ theo kiểu Việt Nam
  return {
    date: vnDateTime.format("DD/MM/YYYY"),  // VD: "26/03/2026"
    time: vnDateTime.format("HH:mm"),        // VD: "19:00"
    dayOfWeek,                               // VD: "Thứ Năm"
    // Chuỗi đầy đủ để hiển thị trên UI
    full: `${vnDateTime.format("HH:mm")} - ${dayOfWeek}, ${vnDateTime.format("DD/MM/YYYY")}`,
  };
}

/**
 * getMatchResult — Xác định kết quả trận đấu cho đội tuyển Việt Nam.
 *
 * @param homeScore  - Số bàn đội nhà (null nếu chưa đá)
 * @param awayScore  - Số bàn đội khách (null nếu chưa đá)
 * @param isHomeTeam - Vietnam có phải đội nhà không
 * @returns "win" | "lose" | "draw" | null (null = chưa có kết quả)
 *
 * VÍ DỤ:
 *   getMatchResult("2", "1", true)  → "win"   (VN đội nhà, thắng 2-1)
 *   getMatchResult("0", "3", true)  → "lose"  (VN đội nhà, thua 0-3)
 *   getMatchResult("1", "1", false) → "draw"  (hòa 1-1)
 */
export function getMatchResult(
  homeScore: string | null,
  awayScore: string | null,
  isHomeTeam: boolean
): "win" | "lose" | "draw" | null {
  // Nếu chưa có tỷ số → trận chưa đá → trả về null
  if (homeScore === null || awayScore === null) return null;

  // Chuyển tỷ số từ string sang number để so sánh
  const home = parseInt(homeScore, 10);
  const away = parseInt(awayScore, 10);

  // Nếu parse lỗi (NaN) → trả về null
  if (isNaN(home) || isNaN(away)) return null;

  // Hòa
  if (home === away) return "draw";

  // Nếu VN là đội nhà: nhà > khách = thắng
  // Nếu VN là đội khách: khách > nhà = thắng
  if (isHomeTeam) {
    return home > away ? "win" : "lose";
  } else {
    return away > home ? "win" : "lose";
  }
}
