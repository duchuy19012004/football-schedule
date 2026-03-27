// ============================================================
// FILE: app/page.tsx
// MỤC ĐÍCH: Trang chủ (Home Page) — trang đầu tiên user thấy
//            khi truy cập website. Lắp ghép tất cả components.
//
// KIẾN TRÚC NEXT.JS (App Router):
//   - File "page.tsx" trong thư mục "app/" = trang gốc ("/")
//   - Đây là SERVER Component (mặc định, không có "use client")
//   - Server Component có thể gọi API trực tiếp bằng async/await
//   - Data được fetch TRÊN SERVER trước khi gửi HTML cho client
//
//   FLOW KHI USER TRUY CẬP localhost:3000:
//     1. Server nhận request từ trình duyệt
//     2. Hàm Home() chạy TRÊN SERVER:
//        a. Gọi getPastMatches() → fetch data từ TheSportsDB
//        b. Gọi getUpcomingMatches() → fetch data trận sắp tới
//        c. Gọi getTeamInfo() → fetch thông tin đội
//     3. Render HTML với data thực
//     4. Gửi HTML hoàn chỉnh cho trình duyệt
//     5. Trình duyệt hiển thị ngay lập tức (không cần đợi JS)
//
//   SO SÁNH VỚI CLIENT-SIDE RENDERING (React thông thường):
//     - React thông thường: trình duyệt nhận HTML trống → tải JS
//       → JS gọi API → nhận data → render UI (chậm hơn)
//     - Next.js Server Component: server làm hết → trình duyệt
//       nhận HTML có sẵn data → hiển thị ngay (nhanh hơn, SEO tốt)
// ============================================================

import { getPastMatches, getUpcomingMatches, getTeamInfo } from "@/lib/api";
// Import 3 hàm gọi API từ lib/api.ts (Phase 2 đã tạo)

import HeroSection from "@/components/HeroSection";
import MatchList from "@/components/MatchList";
import TabBar from "@/components/TabBar";
// Import các components từ Phase 3

// ============================================================
// CẤU HÌNH ISR (Incremental Static Regeneration)
// ============================================================

/**
 * revalidate — Thời gian tái tạo trang (đơn vị: giây).
 *
 * GIẢI THÍCH:
 *   Next.js sẽ CACHE (lưu tạm) trang HTML đã render.
 *   Sau 3600 giây (1 giờ), khi có request mới:
 *     → Server sẽ fetch data mới từ API và render lại trang
 *     → Trang cũ vẫn hiển thị cho user hiện tại (không chờ)
 *     → Trang mới sẵn sàng cho request tiếp theo
 *
 *   LỢI ÍCH:
 *     - Trang tải cực nhanh (đã cache sẵn)
 *     - Data cập nhật mỗi 1 giờ (đủ cho kết quả bóng đá)
 *     - Tiết kiệm API calls (TheSportsDB free = 100 req/ngày)
 *
 *   GIÁ TRỊ KHÁC:
 *     - 0    = render mới mỗi request (không cache)
 *     - 60   = cache 1 phút
 *     - 3600 = cache 1 giờ (giá trị hiện tại)
 *     - false = cache vĩnh viễn (chỉ rebuild khi deploy lại)
 */
export const revalidate = 3600;

// ============================================================
// COMPONENT TRANG CHỦ
// ============================================================

/**
 * Home — Component chính của trang chủ.
 *
 * ĐÂY LÀ ASYNC FUNCTION — một tính năng đặc biệt của
 * Next.js Server Component. Trong React thông thường, component
 * KHÔNG thể là async. Nhưng Server Component thì ĐƯỢC phép,
 * vì nó chạy trên server (không phải trình duyệt).
 *
 * "async" cho phép dùng "await" để đợi API trả về data
 * trước khi render HTML.
 */
export default async function Home() {
  // ============================================================
  // BƯỚC 1: Fetch data từ TheSportsDB API (chạy song song)
  // ============================================================

  /**
   * Promise.all() — Gọi 3 API CÙNG LÚC (song song).
   *
   * GIẢI THÍCH:
   *   Nếu gọi tuần tự (lần lượt):
   *     getPastMatches()    → đợi 500ms
   *     getUpcomingMatches() → đợi 500ms
   *     getTeamInfo()       → đợi 500ms
   *     TỔNG: 1500ms (1.5 giây)
   *
   *   Nếu gọi song song (Promise.all):
   *     3 hàm chạy cùng lúc → đợi hàm chậm nhất
   *     TỔNG: ~500ms (nhanh gấp 3!)
   *
   * Cú pháp [a, b, c] = "destructuring" = gán kết quả vào biến
   */
  const [pastMatches, upcomingMatches, teamInfo] = await Promise.all([
    getPastMatches(),      // Trận đã qua
    getUpcomingMatches(),  // Trận sắp tới
    getTeamInfo(),         // Thông tin đội
  ]);

  // ============================================================
  // BƯỚC 2: Render UI
  // ============================================================

  return (
    // Container chính — giới hạn chiều rộng, căn giữa
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
        {/*
          "max-w-3xl" = chiều rộng tối đa 768px (đọc dễ hơn)
          "mx-auto"   = margin trái/phải tự động → căn giữa
          "px-4"      = padding trái/phải 16px
          "py-6"      = padding trên/dưới 24px (mobile)
          "md:py-10"  = padding trên/dưới 40px (desktop, >= 768px)
        */}

        {/* === HERO SECTION === */}
        {/* Truyền badgeUrl (link logo đội) vào HeroSection */}
        <HeroSection badgeUrl={teamInfo?.strBadge} />
        {/*
          "teamInfo?.strBadge"
          Dấu "?." = optional chaining
          Nghĩa: nếu teamInfo = null → trả về undefined (không crash)
          Nếu teamInfo có data → lấy strBadge (link ảnh logo)
        */}

        {/* === TAB BAR + NỘI DUNG === */}
        {/*
          TabBar là Client Component (có "use client")
          Nó nhận children là 1 HÀM: (activeTab) => JSX

          Khi user click tab:
            - TabBar cập nhật state (activeTab)
            - Gọi lại children(activeTab) với giá trị mới
            - Render nội dung tương ứng

          DATA (pastMatches, upcomingMatches) đã được fetch
          trên server, rồi truyền xuống dưới dạng props.
          Client Component (TabBar) KHÔNG gọi API — chỉ hiển thị.
        */}
        <TabBar>
          {(activeTab) =>
            activeTab === "results" ? (
              // Tab "Kết quả" → hiện danh sách trận đã đá
              <MatchList
                matches={pastMatches}
                title="🏆 Kết quả gần đây"
                emptyMessage="Chưa có kết quả trận đấu nào"
              />
            ) : (
              // Tab "Lịch thi đấu" → hiện danh sách trận sắp tới
              <MatchList
                matches={upcomingMatches}
                title="📅 Lịch thi đấu sắp tới"
                emptyMessage="Chưa có lịch thi đấu sắp tới"
              />
            )
          }
        </TabBar>

        {/* === FOOTER === */}
        <footer className="mt-12 pt-6 border-t border-gray-800/50 text-center">
          <p className="text-xs text-gray-600">
            Dữ liệu được cung cấp bởi{" "}
            <a
              href="https://www.thesportsdb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              TheSportsDB
            </a>
            {" "}• Cập nhật mỗi giờ
          </p>
          <p className="text-[10px] text-gray-700 mt-1">
            🇻🇳 Việt Nam Vô Địch!
          </p>
        </footer>
      </div>
    </main>
  );
}
