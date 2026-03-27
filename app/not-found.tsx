// ============================================================
// FILE: app/not-found.tsx
// MỤC ĐÍCH: Trang 404 — hiển thị khi user truy cập URL không
//            tồn tại (VD: /abc, /xyz...).
//
// KIẾN TRÚC NEXT.JS:
//   - File "not-found.tsx" là FILE ĐẶC BIỆT (file convention)
//   - Next.js tự hiển thị khi:
//     a. User truy cập route không có page.tsx tương ứng
//     b. Code gọi hàm notFound() từ "next/navigation"
// ============================================================

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        {/* Icon bóng đá grunge */}
        <div className="text-8xl mb-4">⚽</div>

        {/* Số 404 lớn với gradient */}
        <h1 className="text-6xl font-extrabold mb-2">
          <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
            404
          </span>
        </h1>

        {/* Mô tả */}
        <p className="text-gray-400 text-lg mb-6">
          Trang này không tồn tại — giống như bàn thắng bị VAR từ chối! 😄
        </p>

        {/* Nút quay về trang chủ */}
        <a
          href="/"
          className="
            inline-flex items-center gap-2
            px-6 py-3 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-red-600 to-red-700
            text-white shadow-lg shadow-red-500/20
            hover:from-red-500 hover:to-red-600
            transition-all duration-300
            hover:-translate-y-0.5
          "
        >
          🏠 Về trang chủ
        </a>
      </div>
    </main>
  );
}
