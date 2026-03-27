// ============================================================
// FILE: app/global-error.tsx
// MỤC ĐÍCH: Xử lý lỗi TOÀN CỤC — khi cả layout.tsx cũng bị lỗi.
//
// KIẾN TRÚC NEXT.JS:
//   - error.tsx chỉ bắt lỗi từ page.tsx (cùng cấp)
//   - global-error.tsx bắt lỗi từ layout.tsx (root layout)
//   - ⚠️ Vì layout.tsx chứa <html><body>, global-error PHẢI
//     tự định nghĩa <html><body> của riêng mình
//   - File này hiếm khi được trigger (layout ít khi lỗi)
// ============================================================

"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    // Phải có <html> và <body> vì root layout đã bị lỗi
    <html lang="vi">
      <body className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-xl font-bold text-white mb-2">
            Lỗi nghiêm trọng!
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Trang web gặp lỗi không mong muốn. Vui lòng thử lại.
          </p>
          <button
            onClick={() => unstable_retry()}
            className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500 transition-colors"
          >
            🔄 Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
