// ============================================================
// FILE: components/MatchCard.tsx
// MỤC ĐÍCH: Component hiển thị thông tin 1 trận đấu dưới dạng
//            "card" (thẻ). Mỗi card chứa: logo 2 đội, tỷ số
//            (hoặc giờ đá), tên giải, ngày giờ.
//
// KIẾN TRÚC NEXT.JS:
//   - Đây là SERVER Component (không có "use client" ở đầu file)
//   - Server Component = render trên server → gửi HTML cho client
//   - Không cần interactivity (click/hover state) nên dùng Server
//   - Logo đội bóng dùng component <Image> của Next.js để tối ưu
// ============================================================

import Image from "next/image";
// import Image từ next/image thay vì dùng <img> HTML thông thường
// Lý do: Next.js Image tự động:
//   - Resize ảnh theo kích thước cần thiết
//   - Chuyển sang format WebP (nhỏ hơn)
//   - Lazy loading (chỉ tải khi cuộn đến)

import { MatchEvent, VIETNAM_TEAM_ID } from "@/types/match";
import { formatMatchDate, getMatchResult } from "@/lib/utils";

// ============================================================
// ĐỊNH NGHĨA PROPS (tham số đầu vào của component)
// ============================================================

/**
 * Props cho MatchCard component.
 *
 * "interface" = mô tả hình dạng của object trong TypeScript.
 * Component nhận vào 1 prop là "match" (dữ liệu 1 trận đấu).
 */
interface MatchCardProps {
  match: MatchEvent;   // Dữ liệu trận đấu (từ types/match.ts)
}

// ============================================================
// COMPONENT CHÍNH
// ============================================================

/**
 * MatchCard — Component hiển thị 1 trận đấu.
 *
 * CÁCH SỬ DỤNG:
 *   <MatchCard match={matchData} />
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

  // --- Bước 4: Chọn màu viền theo kết quả ---
  // Mỗi kết quả có màu khác nhau để user dễ nhận biết
  const resultStyles: Record<string, string> = {
    win: "border-l-green-500 bg-green-500/5",    // Xanh lá = thắng
    lose: "border-l-red-500 bg-red-500/5",        // Đỏ = thua
    draw: "border-l-yellow-500 bg-yellow-500/5",  // Vàng = hòa
  };
  // Nếu chưa có kết quả (chưa đá) → viền xanh dương
  const cardStyle = result
    ? resultStyles[result]
    : "border-l-blue-500 bg-blue-500/5";

  // --- Bước 5: Kiểm tra đã có tỷ số chưa ---
  const hasScore =
    match.intHomeScore !== null && match.intAwayScore !== null;

  // --- Render JSX (HTML-like template) ---
  return (
    // Thẻ div bao ngoài — viền trái 4px, bo góc, hiệu ứng hover
    <div
      className={`
        border-l-4 ${cardStyle}
        rounded-xl p-4 md:p-5
        transition-all duration-300
        hover:shadow-lg hover:shadow-black/5
        hover:-translate-y-0.5
      `}
      // "transition-all duration-300" = animation mượt 300ms khi hover
      // "hover:-translate-y-0.5" = nhấc card lên 2px khi hover
    >
      {/* --- Tên giải đấu + Vòng đấu --- */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Logo giải đấu (nếu có) */}
          {match.strLeagueBadge && (
            <Image
              src={match.strLeagueBadge}
              alt={match.strLeague}
              width={20}
              height={20}
              className="rounded"
              // Next.js Image yêu cầu width + height để tránh layout shift
            />
          )}
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {match.strLeague}
          </span>
        </div>

        {/* Badge kết quả (W/L/D) */}
        {result && (
          <span
            className={`
              text-xs font-bold px-2 py-0.5 rounded-full
              ${result === "win" ? "bg-green-500/20 text-green-400" : ""}
              ${result === "lose" ? "bg-red-500/20 text-red-400" : ""}
              ${result === "draw" ? "bg-yellow-500/20 text-yellow-400" : ""}
            `}
          >
            {/* Hiển thị chữ Việt thay vì W/L/D */}
            {result === "win" ? "THẮNG" : result === "lose" ? "THUA" : "HÒA"}
          </span>
        )}
      </div>

      {/* --- Phần chính: 2 đội + tỷ số --- */}
      <div className="flex items-center justify-between gap-2">
        {/* === ĐỘI NHÀ (bên trái) === */}
        <div className="flex-1 flex items-center gap-3">
          {/* Logo đội nhà */}
          {match.strHomeTeamBadge && (
            <Image
              src={match.strHomeTeamBadge}
              alt={match.strHomeTeam}
              width={40}
              height={40}
              className="rounded-lg"
            />
          )}
          <span
            className={`
              text-sm md:text-base font-semibold
              ${match.idHomeTeam === VIETNAM_TEAM_ID
                ? "text-yellow-400"   // Nếu VN = highlight vàng
                : "text-gray-200"     // Đội khác = màu xám nhạt
              }
            `}
          >
            {match.strHomeTeam}
          </span>
        </div>

        {/* === TỶ SỐ (ở giữa) === */}
        <div className="flex-shrink-0 text-center px-4">
          {hasScore ? (
            // Đã có kết quả → hiển thị tỷ số lớn
            <div className="text-2xl md:text-3xl font-bold text-white">
              {match.intHomeScore}
              <span className="text-gray-500 mx-1">-</span>
              {match.intAwayScore}
            </div>
          ) : (
            // Chưa đá → hiển thị giờ kick-off
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

        {/* === ĐỘI KHÁCH (bên phải) === */}
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
          {/* Logo đội khách */}
          {match.strAwayTeamBadge && (
            <Image
              src={match.strAwayTeamBadge}
              alt={match.strAwayTeam}
              width={40}
              height={40}
              className="rounded-lg"
            />
          )}
        </div>
      </div>

      {/* --- Ngày giờ + Địa điểm (phía dưới) --- */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        {/* Biểu tượng lịch + ngày giờ đầy đủ */}
        <span>📅 {dateInfo.full}</span>

        {/* Tên sân vận động (nếu có) */}
        {match.strVenue && <span>📍 {match.strVenue}</span>}
      </div>
    </div>
  );
}
