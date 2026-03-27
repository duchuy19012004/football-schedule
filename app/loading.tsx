// ============================================================
// FILE: app/loading.tsx
// MỤC ĐÍCH: Hiển thị "loading skeleton" khi trang đang tải data.
//
// KIẾN TRÚC NEXT.JS (App Router):
//   - File "loading.tsx" là FILE ĐẶC BIỆT (file convention)
//   - Next.js TỰ ĐỘNG hiển thị component này khi page.tsx
//     đang fetch data (await getPastMatches()...)
//   - Không cần import hay gọi thủ công — Next.js tự lo!
//
//   FLOW:
//     1. User truy cập "/" → Next.js bắt đầu render page.tsx
//     2. page.tsx có "await" (đợi API) → mất vài giây
//     3. TRONG KHI ĐỢI → Next.js hiển thị loading.tsx
//     4. Khi data sẵn sàng → Next.js thay thế loading bằng page.tsx
//
//   KỸ THUẬT "SKELETON":
//     Skeleton = bộ xương → hiển thị khung giao diện trống
//     với hiệu ứng nhấp nháy (animate-pulse), giống như
//     Facebook/YouTube khi đang tải nội dung.
//     Mục đích: user biết trang đang load (không phải bị lỗi)
// ============================================================

export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
        {/* === HERO SKELETON === */}
        {/* Mô phỏng HeroSection khi chưa có data */}
        <div className="relative overflow-hidden rounded-2xl mb-8 bg-gray-800/50 animate-pulse">
          <div className="px-6 py-10 md:py-16 flex flex-col items-center">
            {/* Vòng tròn giả logo */}
            <div className="w-20 h-20 bg-gray-700 rounded-xl mb-4" />
            {/* Thanh giả tiêu đề */}
            <div className="h-10 w-72 bg-gray-700 rounded-lg mb-2" />
            {/* Thanh giả mô tả */}
            <div className="h-4 w-56 bg-gray-700/50 rounded mt-2" />
            {/* Đường kẻ giả */}
            <div className="w-16 h-1 bg-gray-700 rounded-full mt-4 mb-5" />
            {/* Tags giả */}
            <div className="flex gap-3">
              <div className="h-7 w-36 bg-gray-700/30 rounded-full" />
              <div className="h-7 w-24 bg-gray-700/30 rounded-full" />
              <div className="h-7 w-32 bg-gray-700/30 rounded-full" />
            </div>
          </div>
        </div>

        {/* === TAB BAR SKELETON === */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-800/50 rounded-xl">
          <div className="flex-1 h-11 bg-gray-700/50 rounded-lg animate-pulse" />
          <div className="flex-1 h-11 bg-gray-700/30 rounded-lg animate-pulse" />
        </div>

        {/* === MATCH LIST SKELETON === */}
        {/* Header: tiêu đề + badge số trận */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 w-48 bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-6 w-16 bg-gray-800/50 rounded-full animate-pulse" />
        </div>

        {/* Render 5 MatchCard skeleton */}
        <div className="flex flex-col gap-3">
          {/*
            Array.from({ length: 5 }) = tạo mảng 5 phần tử
            .map((_, i) => ...) = duyệt qua, "i" là index (0,1,2,3,4)
            Dấu "_" = bỏ qua giá trị, chỉ dùng index
          */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border-l-4 border-l-gray-700 bg-gray-800/30 rounded-xl p-4 md:p-5 animate-pulse"
              // Hiệu ứng animate-pulse = nhấp nháy sáng/tối
            >
              {/* Dòng 1: Giải đấu */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-gray-700 rounded" />
                <div className="h-3 w-32 bg-gray-700 rounded" />
              </div>

              {/* Dòng 2: Đội nhà - Tỷ số - Đội khách */}
              <div className="flex items-center justify-between">
                {/* Đội nhà */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg" />
                  <div className="h-4 w-24 bg-gray-700 rounded" />
                </div>
                {/* Tỷ số */}
                <div className="h-8 w-20 bg-gray-700 rounded-lg mx-4" />
                {/* Đội khách */}
                <div className="flex-1 flex items-center justify-end gap-3">
                  <div className="h-4 w-24 bg-gray-700 rounded" />
                  <div className="w-10 h-10 bg-gray-700 rounded-lg" />
                </div>
              </div>

              {/* Dòng 3: Ngày giờ */}
              <div className="mt-3 flex gap-4">
                <div className="h-3 w-44 bg-gray-700/50 rounded" />
                <div className="h-3 w-28 bg-gray-700/50 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
