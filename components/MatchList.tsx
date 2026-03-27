// ============================================================
// FILE: components/MatchList.tsx
// MỤC ĐÍCH: Component hiển thị danh sách nhiều trận đấu.
//            Nhận vào mảng trận đấu → render ra nhiều MatchCard.
//
// KIẾN TRÚC NEXT.JS:
//   - Đây là SERVER Component (không có "use client")
//   - Nhận data từ page.tsx (đã fetch trên server) qua props
//   - Chỉ render HTML, không có interactivity
//
// CÁCH HOẠT ĐỘNG:
//   page.tsx fetch data → truyền vào MatchList → MatchList render
//   từng MatchCard cho mỗi trận đấu trong mảng.
// ============================================================

import { MatchEvent } from "@/types/match";
import MatchCard from "./MatchCard";

// ============================================================
// PROPS
// ============================================================

interface MatchListProps {
  matches: MatchEvent[]; // Mảng các trận đấu (array of MatchEvent)
  title: string;         // Tiêu đề section, VD: "Kết quả gần đây"
  emptyMessage: string;  // Thông báo khi không có trận nào
}

// ============================================================
// COMPONENT CHÍNH
// ============================================================

/**
 * MatchList — Hiển thị danh sách trận đấu dưới dạng grid.
 *
 * CÁCH SỬ DỤNG:
 *   <MatchList
 *     matches={pastMatches}
 *     title="Kết quả gần đây"
 *     emptyMessage="Không có trận đấu nào"
 *   />
 *
 * HIỂN THỊ:
 *   ┌─────────────────────┐
 *   │ 🏆 Kết quả gần đây │  ← title
 *   │ 5 trận đấu          │  ← số lượng trận
 *   ├─────────────────────┤
 *   │ [MatchCard 1]       │
 *   │ [MatchCard 2]       │
 *   │ [MatchCard 3]       │
 *   │ ...                 │
 *   └─────────────────────┘
 */
export default function MatchList({
  matches,
  title,
  emptyMessage,
}: MatchListProps) {
  return (
    <section className="w-full">
      {/* --- Header: Tiêu đề + số lượng trận --- */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          {title}
        </h2>
        {/* Badge hiển thị số trận */}
        <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
          {matches.length} trận
        </span>
      </div>

      {/* --- Nội dung: Danh sách trận hoặc thông báo trống --- */}
      {matches.length > 0 ? (
        // Nếu CÓ trận → render danh sách MatchCard
        // "flex flex-col gap-3" = xếp dọc, cách nhau 12px
        <div className="flex flex-col gap-3">
          {/*
            .map() = duyệt qua từng phần tử trong mảng
            Với mỗi trận đấu (match), render 1 component <MatchCard>

            "key" là thuộc tính BẮT BUỘC khi render danh sách trong React.
            React dùng key để biết phần tử nào thay đổi khi re-render.
            Dùng idEvent vì nó là ID duy nhất cho mỗi trận.
          */}
          {matches.map((match) => (
            <MatchCard key={match.idEvent} match={match} />
          ))}
        </div>
      ) : (
        // Nếu KHÔNG có trận → hiển thị thông báo trống
        <div className="text-center py-12 rounded-xl bg-gray-800/30 border border-gray-700/50">
          <div className="text-4xl mb-3">⚽</div>
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
}
