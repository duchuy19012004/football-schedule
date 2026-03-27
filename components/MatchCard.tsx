// ============================================================
// FILE: components/MatchCard.tsx
// MỤC ĐÍCH: Component hiển thị thông tin 1 trận đấu dưới dạng
//            "card" (thẻ). Mỗi card chứa: logo 2 đội, tỷ số
//            (hoặc giờ đá), tên giải, ngày giờ.
//
// KIẾN TRÚC NEXT.JS:
//   - Đây là SERVER Component (không có "use client" ở đầu file)
//   - Server Component = render trên server → gửi HTML cho client
//   - Dùng thẻ <img> thay vì <Image> của Next.js cho logo
//     vì ảnh đến từ nhiều API domains khác nhau (TheSportsDB,
//     API-Football) và Next.js Image optimizer có thể bị lỗi 500
//     khi xử lý ảnh từ external domains.
// ============================================================

import { MatchEvent, VIETNAM_TEAM_ID } from "@/types/match";
import { formatMatchDate, getMatchResult } from "@/lib/utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// Kích hoạt plugin UTC cho dayjs
dayjs.extend(utc);

// ============================================================
// ĐỊNH NGHĨA PROPS
// ============================================================

interface MatchCardProps {
  match: MatchEvent;
}

// ============================================================
// COMPONENT CHÍNH
// ============================================================

/**
 * MatchCard — Component hiển thị 1 trận đấu.
 *
 * HIỂN THỊ:
 *   ┌──────────────────────────────────┐
 *   │ 🏆 World Cup Qualifying AFC     │
 *   │                                  │
 *   │  🇻🇳 Vietnam   2 - 1   Laos 🇱🇦  │
 *   │                                  │
 *   │ 📅 19:00 - Thứ Ba, 25/03/2025   │
 *   │ 📍 Sân Mỹ Đình                  │
 *   └──────────────────────────────────┘
 */
export default function MatchCard({ match }: MatchCardProps) {
  // --- Bước 1: Format ngày giờ sang giờ Việt Nam ---
  const dateInfo = formatMatchDate(match.dateEvent, match.strTime);

  // --- Bước 2: Xác định VN là đội nhà hay đội khách ---
  const isVietnamHome = match.idHomeTeam === VIETNAM_TEAM_ID;

  // --- Bước 3: Xác định kết quả (thắng/thua/hòa/chưa đá) ---
  const result = getMatchResult(
    match.intHomeScore,
    match.intAwayScore,
    isVietnamHome
  );

  // --- Bước 4: Kiểm tra đã có tỷ số chưa ---
  const hasScore =
    match.intHomeScore !== null && match.intAwayScore !== null;

  // --- Bước 5: Kiểm tra trận ĐÃ QUA thời gian nhưng CHƯA có tỷ số ---
  const matchTime = dayjs.utc(`${match.dateEvent}T${match.strTime}`);
  const now = dayjs.utc();
  const isPastKickoff = now.isAfter(matchTime.add(2, "hour"));
  const isAwaitingScore = isPastKickoff && !hasScore;

  // --- Bước 6: Chọn màu viền theo kết quả ---
  const resultStyles: Record<string, string> = {
    win: "border-l-green-500 bg-green-500/5",
    lose: "border-l-red-500 bg-red-500/5",
    draw: "border-l-yellow-500 bg-yellow-500/5",
  };

  let cardStyle: string;
  if (result) {
    cardStyle = resultStyles[result];
  } else if (isAwaitingScore) {
    cardStyle = "border-l-orange-500 bg-orange-500/5";
  } else {
    cardStyle = "border-l-blue-500 bg-blue-500/5";
  }

  return (
    <div
      className={`
        border-l-4 ${cardStyle}
        rounded-xl p-4 md:p-5
        transition-all duration-300
        hover:shadow-lg hover:shadow-black/5
        hover:-translate-y-0.5
      `}
    >
      {/* --- Tên giải đấu --- */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {match.strLeagueBadge && (
            // Dùng <img> thay vì <Image> để tránh lỗi optimizer
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={match.strLeagueBadge}
              alt={match.strLeague}
              width={20}
              height={20}
              className="rounded w-5 h-5 object-contain"
            />
          )}
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {match.strLeague}
          </span>
        </div>

        {/* Badge kết quả */}
        {result && (
          <span
            className={`
              text-xs font-bold px-2 py-0.5 rounded-full
              ${result === "win" ? "bg-green-500/20 text-green-400" : ""}
              ${result === "lose" ? "bg-red-500/20 text-red-400" : ""}
              ${result === "draw" ? "bg-yellow-500/20 text-yellow-400" : ""}
            `}
          >
            {result === "win" ? "THẮNG" : result === "lose" ? "THUA" : "HÒA"}
          </span>
        )}
        {isAwaitingScore && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
            CHỜ CẬP NHẬT
          </span>
        )}
      </div>

      {/* --- Phần chính: 2 đội + tỷ số --- */}
      <div className="flex items-center justify-between gap-2">
        {/* === ĐỘI NHÀ === */}
        <div className="flex-1 flex items-center gap-3">
          {match.strHomeTeamBadge && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={match.strHomeTeamBadge}
              alt={match.strHomeTeam}
              width={40}
              height={40}
              className="rounded-lg w-10 h-10 object-contain"
            />
          )}
          <span
            className={`
              text-sm md:text-base font-semibold
              ${match.idHomeTeam === VIETNAM_TEAM_ID
                ? "text-yellow-400"
                : "text-gray-200"
              }
            `}
          >
            {match.strHomeTeam}
          </span>
        </div>

        {/* === TỶ SỐ === */}
        <div className="flex-shrink-0 text-center px-4">
          {hasScore ? (
            <div className="text-2xl md:text-3xl font-bold text-white">
              {match.intHomeScore}
              <span className="text-gray-500 mx-1">-</span>
              {match.intAwayScore}
            </div>
          ) : isAwaitingScore ? (
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold text-orange-400">
                ? - ?
              </div>
              <div className="text-[10px] text-orange-400/70 uppercase">
                Đang cập nhật
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-blue-400">
                {dateInfo.time}
              </div>
              <div className="text-[10px] text-gray-500 uppercase">
                Giờ VN
              </div>
            </div>
          )}
        </div>

        {/* === ĐỘI KHÁCH === */}
        <div className="flex-1 flex items-center justify-end gap-3">
          <span
            className={`
              text-sm md:text-base font-semibold text-right
              ${match.idAwayTeam === VIETNAM_TEAM_ID
                ? "text-yellow-400"
                : "text-gray-200"
              }
            `}
          >
            {match.strAwayTeam}
          </span>
          {match.strAwayTeamBadge && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={match.strAwayTeamBadge}
              alt={match.strAwayTeam}
              width={40}
              height={40}
              className="rounded-lg w-10 h-10 object-contain"
            />
          )}
        </div>
      </div>

      {/* --- Ngày giờ + Địa điểm --- */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        <span>📅 {dateInfo.full}</span>
        {match.strVenue && <span>📍 {match.strVenue}</span>}
      </div>
    </div>
  );
}
