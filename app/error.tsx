// ============================================================
// FILE: app/error.tsx
// MỤC ĐÍCH: Xử lý lỗi khi page.tsx gặp vấn đề (API crash,
//            mất mạng, dữ liệu sai format...).
//
// KIẾN TRÚC NEXT.JS (App Router):
//   - File "error.tsx" là FILE ĐẶC BIỆT (file convention)
//   - Next.js TỰ ĐỘNG bắt lỗi từ page.tsx và hiển thị file này
//   - ⚠️ error.tsx BẮT BUỘC phải là Client Component ("use client")
//     vì nó cần dùng useEffect và onClick (chỉ chạy trên browser)
//
//   FLOW KHI CÓ LỖI:
//     1. page.tsx gọi API → API trả lỗi / mất mạng
//     2. page.tsx throw Error (hoặc lỗi không bắt được)
//     3. Next.js bắt error → hiển thị error.tsx thay cho page.tsx
//     4. User nhấn "Thử lại" → Next.js gọi unstable_retry()
//        → render lại page.tsx (fetch API lần nữa)
//
//   LƯU Ý:
//     - error.tsx KHÔNG bắt lỗi từ layout.tsx (cùng cấp)
//     - Muốn bắt lỗi layout → dùng global-error.tsx
// ============================================================

"use client";
// ↑ BẮT BUỘC: Error boundary phải là Client Component

import { useEffect } from "react";
// useEffect = React Hook chạy 1 lần sau khi component render

// ============================================================
// COMPONENT
// ============================================================

/**
 * ErrorPage — Hiển thị khi trang gặp lỗi.
 *
 * @param error          - Object lỗi (chứa message, stack trace...)
 * @param unstable_retry - Hàm thử lại (Next.js 16 dùng unstable_retry thay vì reset)
 *
 * HIỂN THỊ:
 *   ┌──────────────────────────────────┐
 *   │         ⚠️                        │
 *   │    Đã xảy ra lỗi!               │
 *   │    Lỗi: Cannot fetch data...     │
 *   │                                  │
 *   │    [🔄 Thử lại]  [🏠 Trang chủ] │
 *   └──────────────────────────────────┘
 */
export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  // "Error & { digest?: string }" = Error object + thêm trường digest (tùy chọn)
  // "digest" là mã lỗi ngắn mà Next.js tạo cho production (không lộ chi tiết)
  unstable_retry: () => void;
  // "() => void" = hàm không nhận tham số, không trả giá trị
}) {
  // === useEffect: Log lỗi ra console ===
  // Chạy 1 lần khi component mount (xuất hiện trên màn hình)
  // [error] = dependency array → chạy lại nếu error thay đổi
  useEffect(() => {
    console.error("❌ Lỗi trang:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      {/* Card lỗi: nền tối, viền đỏ, căn giữa */}
      <div className="max-w-md w-full text-center p-8 rounded-2xl bg-gray-900/80 border border-red-500/20">
        {/* Icon cảnh báo lớn */}
        <div className="text-6xl mb-4">⚠️</div>

        {/* Tiêu đề */}
        <h2 className="text-xl font-bold text-white mb-2">
          Đã xảy ra lỗi!
        </h2>

        {/* Mô tả lỗi */}
        <p className="text-gray-400 text-sm mb-6">
          Không thể tải dữ liệu trận đấu. Có thể do mất kết nối mạng
          hoặc API đang bảo trì.
        </p>

        {/* Chi tiết lỗi (chỉ hiện trên development) */}
        {error.message && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-400 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* 2 nút: Thử lại + Trang chủ */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => unstable_retry()}
            // unstable_retry() = Next.js re-render lại page.tsx
            // (gọi API lần nữa, hy vọng lần này thành công)
            className="
              px-6 py-3 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-red-600 to-red-700
              text-white shadow-lg shadow-red-500/20
              hover:from-red-500 hover:to-red-600
              transition-all duration-300
              hover:-translate-y-0.5
            "
          >
            🔄 Thử lại
          </button>

          <a
            href="/"
            // href="/" = quay về trang chủ (full page reload)
            className="
              px-6 py-3 rounded-xl font-semibold text-sm
              border border-gray-700 text-gray-300
              hover:bg-gray-800 hover:text-white
              transition-all duration-300
            "
          >
            🏠 Trang chủ
          </a>
        </div>
      </div>
    </main>
  );
}
