// ============================================================
// FILE: components/HeroSection.tsx
// MỤC ĐÍCH: Component "Hero" = phần banner lớn ở đầu trang.
//            Hiển thị logo ĐT Việt Nam, tên trang, mô tả ngắn.
//
// KIẾN TRÚC NEXT.JS:
//   - Server Component (không cần interactivity)
//   - Render HTML tĩnh trên server → SEO tốt
//   - Dùng gradient CSS để tạo nền đẹp
// ============================================================

import Image from "next/image";

// ============================================================
// COMPONENT CHÍNH
// ============================================================

/**
 * HeroSection — Banner đầu trang với thông tin ĐT Việt Nam.
 *
 * HIỂN THỊ:
 *   ┌──────────────────────────────────────┐
 *   │  🇻🇳                                 │
 *   │  ĐỘI TUYỂN VIỆT NAM                 │  ← gradient text
 *   │  Tổng hợp lịch thi đấu & kết quả    │
 *   │  ─────────────────                   │
 *   │  🏟 Sân Mỹ Đình  ⭐ Rồng Vàng       │
 *   └──────────────────────────────────────┘
 *
 * @param badgeUrl - URL ảnh logo ĐT Việt Nam từ API (tùy chọn)
 */
export default function HeroSection({
  badgeUrl,
}: {
  badgeUrl?: string; // Dấu "?" = tham số không bắt buộc (optional)
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl mb-8">
      {/* === NỀN GRADIENT ===
          Tạo nền gradient từ đỏ đậm → đỏ tối
          Màu đỏ tượng trưng cho ĐT Việt Nam 🇻🇳 */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-red-800/60 to-gray-900" />

      {/* Hiệu ứng decorative: vòng tròn vàng mờ ở góc */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-500/20 rounded-full blur-2xl" />

      {/* === NỘI DUNG HERO === */}
      <div className="relative z-10 px-6 py-10 md:py-16 flex flex-col items-center text-center">
        {/* Logo ĐT Việt Nam */}
        {badgeUrl && (
          <div className="mb-4 drop-shadow-2xl">
            <Image
              src={badgeUrl}
              alt="Logo Đội tuyển Việt Nam"
              width={80}
              height={80}
              className="rounded-xl"
              priority
              // "priority" = tải ảnh này trước (không lazy load)
              // Vì logo ở đầu trang, cần hiển thị ngay lập tức
            />
          </div>
        )}

        {/* Tiêu đề chính — dùng gradient text */}
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2">
          <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            ĐỘI TUYỂN VIỆT NAM
          </span>
          {/*
            "bg-clip-text text-transparent"
            = Trick CSS: tô gradient lên nền rồi cắt (clip) theo chữ
            → chữ có hiệu ứng gradient rất đẹp ✨
          */}
        </h1>

        {/* Mô tả phụ */}
        <p className="text-gray-300 text-sm md:text-base max-w-md">
          Tổng hợp lịch thi đấu và kết quả các trận đấu
        </p>

        {/* Đường kẻ trang trí */}
        <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full mt-4 mb-5" />

        {/* Thông tin nhanh */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
            🏟️ Sân vận động Mỹ Đình
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
            ⭐ Rồng Vàng
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
            📍 Hà Nội, Việt Nam
          </span>
        </div>
      </div>
    </section>
  );
}
