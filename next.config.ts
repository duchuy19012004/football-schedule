import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================================================
  // CẤU HÌNH HÌNH ẢNH (Image Configuration)
  //
  // Next.js mặc định CHẶN tải ảnh từ domain bên ngoài vì lý do
  // bảo mật. Phải khai báo rõ ràng domain nào được phép.
  // TheSportsDB lưu ảnh tại "r2.thesportsdb.com".
  // ============================================================
  images: {
    remotePatterns: [
      {
        protocol: "https",                // Giao thức: HTTPS
        hostname: "r2.thesportsdb.com",   // Domain chứa ảnh TheSportsDB
        pathname: "/images/**",           // Cho phép tất cả ảnh trong /images/
      },
    ],
  },
};

export default nextConfig;
