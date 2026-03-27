// ============================================================
// FILE: app/layout.tsx
// MỤC ĐÍCH: Layout gốc (Root Layout) — bao bọc TẤT CẢ các trang.
//
// KIẾN TRÚC NEXT.JS (App Router):
//   - layout.tsx = "khung" chung cho mọi trang
//   - Mọi page.tsx sẽ được render BÊN TRONG layout này
//   - Tương tự như <html><body>...nội dung...</body></html>
//
//   CẤU TRÚC:
//     layout.tsx (file này)
//       └── page.tsx (trang chủ)
//
//   KHI USER TRUY CẬP localhost:3000:
//     1. Next.js render layout.tsx → tạo khung HTML
//     2. Bên trong {children} → render page.tsx
//     3. Gửi HTML hoàn chỉnh cho trình duyệt
//
// METADATA:
//   - "metadata" là object đặc biệt mà Next.js tự đọc
//   - Dùng để set <title>, <meta description> cho SEO
//   - Chỉ hoạt động trong Server Component
// ============================================================

import type { Metadata } from "next";
// "Metadata" = kiểu TypeScript của Next.js cho object metadata

import { Geist, Geist_Mono } from "next/font/google";
// Import font từ Google Fonts qua next/font
// Next.js sẽ tự tải font và lưu local (không gọi đến Google khi user truy cập)

import "./globals.css";
// Import file CSS toàn cục — áp dụng cho mọi trang

// ============================================================
// CẤU HÌNH FONT CHỮ
// ============================================================

/**
 * Geist Sans — Font chữ chính cho nội dung.
 * "subsets: ['latin']" = chỉ tải bộ ký tự Latin (tiếng Anh)
 *   → Font vẫn hiển thị tiếng Việt, chỉ là không tối ưu hóa
 *       các ký tự đặc biệt tiếng Việt (dấu)
 */
const geistSans = Geist({
  variable: "--font-geist-sans",  // Tên biến CSS để dùng trong Tailwind
  subsets: ["latin"],
});

/**
 * Geist Mono — Font monospace cho số, tỷ số.
 * Font monospace = mỗi ký tự có cùng chiều rộng (1 = i)
 * Giúp tỷ số thẳng hàng đẹp hơn.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ============================================================
// METADATA — Thông tin SEO cho trang web
// ============================================================

/**
 * metadata — Next.js tự đọc object này và tạo thẻ <title>, <meta>
 *
 * KẾT QUẢ TRÊN TRÌNH DUYỆT:
 *   <head>
 *     <title>ĐT Việt Nam | Lịch thi đấu & Kết quả</title>
 *     <meta name="description" content="Tổng hợp..." />
 *   </head>
 *
 * Google cũng sử dụng metadata này khi hiển thị kết quả tìm kiếm.
 */
export const metadata: Metadata = {
  title: "ĐT Việt Nam | Lịch thi đấu & Kết quả",
  description:
    "Tổng hợp lịch thi đấu và kết quả các trận đấu của Đội tuyển Quốc gia Việt Nam. Cập nhật tỷ số, thời gian, địa điểm thi đấu.",
  // Thêm các thẻ SEO mở rộng (Open Graph) cho chia sẻ Facebook
  openGraph: {
    title: "ĐT Việt Nam | Lịch thi đấu & Kết quả",
    description: "Tổng hợp lịch thi đấu và kết quả của ĐT Việt Nam",
    type: "website",
  },
};

// ============================================================
// ROOT LAYOUT COMPONENT
// ============================================================

/**
 * RootLayout — Component layout gốc, bao bọc toàn bộ app.
 *
 * @param children - Nội dung của trang con (page.tsx)
 *
 * FLOW:
 *   User truy cập "/" → Next.js gọi RootLayout
 *   → {children} = nội dung từ app/page.tsx
 *   → HTML hoàn chỉnh gửi đến trình duyệt
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  // "Readonly" = không cho phép thay đổi props (immutable)
  // "React.ReactNode" = bất kỳ thứ gì React render được (JSX, string, number...)
}>) {
  return (
    <html
      lang="vi"
      // lang="vi" = khai báo trang web bằng tiếng Việt (SEO + accessibility)
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // geistSans.variable, geistMono.variable = kích hoạt font qua CSS variables
      // "h-full" = height: 100%
      // "antialiased" = làm mịn chữ trên màn hình
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* 
          "min-h-full" = chiều cao tối thiểu 100% viewport
          "flex flex-col" = dùng flexbox dọc để footer luôn dính dưới
          "bg-background" = dùng màu nền từ globals.css (--color-background)
          "text-foreground" = dùng màu chữ từ globals.css (--color-foreground)
        */}
        {children}
        {/* 
          {children} = nơi page.tsx sẽ được render
          Khi user truy cập "/", children = nội dung từ app/page.tsx
        */}
      </body>
    </html>
  );
}
