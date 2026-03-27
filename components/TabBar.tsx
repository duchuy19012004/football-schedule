// ============================================================
// FILE: components/TabBar.tsx
// MỤC ĐÍCH: Component tab để chuyển giữa "Kết quả" và
//            "Lịch thi đấu". Khi user click tab, nội dung
//            tương ứng sẽ hiện ra.
//
// KIẾN TRÚC NEXT.JS:
//   ⚠️ Đây là CLIENT Component (CÓ "use client" ở dòng đầu)
//
//   TẠI SAO? Vì component này cần:
//   - useState  = lưu trạng thái tab nào đang active
//   - onClick   = xử lý sự kiện click chuột
//
//   Trong Next.js, chỉ Client Component mới dùng được:
//   - React hooks (useState, useEffect, useRef...)
//   - Event handlers (onClick, onChange, onSubmit...)
//   - Browser APIs (window, document, localStorage...)
//
//   Server Component (mặc định) KHÔNG dùng được những thứ trên.
// ============================================================

"use client";
// ↑ DÒNG QUAN TRỌNG NHẤT: Khai báo đây là Client Component
// Phải đặt ở dòng đầu tiên, trước mọi import

import { useState, type ReactNode } from "react";
// useState = React Hook để quản lý state (trạng thái)
// ReactNode = kiểu dữ liệu cho "bất kỳ thứ gì render được trong React"

// ============================================================
// PROPS
// ============================================================

interface TabBarProps {
  // "children" đặc biệt: là nội dung BÊN TRONG component
  // VD: <TabBar> <div>Nội dung</div> </TabBar>
  //     → children = <div>Nội dung</div>
  //
  // Ở đây ta dùng "render props pattern":
  // children là 1 HÀM nhận vào tab hiện tại, trả về JSX
  children: (activeTab: "results" | "upcoming") => ReactNode;
}

// ============================================================
// COMPONENT CHÍNH
// ============================================================

/**
 * TabBar — Component chuyển tab giữa Kết quả / Lịch thi đấu.
 *
 * CÁCH SỬ DỤNG (ở page.tsx):
 *   <TabBar>
 *     {(activeTab) => (
 *       activeTab === "results"
 *         ? <MatchList ... />    // Hiện kết quả
 *         : <MatchList ... />    // Hiện lịch thi đấu
 *     )}
 *   </TabBar>
 *
 * HIỂN THỊ:
 *   ┌──────────────────────────────────┐
 *   │  [🏆 Kết quả]  [📅 Lịch thi đấu] │  ← 2 tab buttons
 *   └──────────────────────────────────┘
 *   Khi click tab → nội dung bên dưới thay đổi tương ứng
 */
export default function TabBar({ children }: TabBarProps) {
  // === useState HOOK ===
  // activeTab = biến lưu tab hiện tại ("results" hoặc "upcoming")
  // setActiveTab = hàm để thay đổi giá trị activeTab
  // "results" = giá trị mặc định (ban đầu hiển thị tab Kết quả)
  const [activeTab, setActiveTab] = useState<"results" | "upcoming">(
    "results"
  );

  // Cấu hình 2 tab (để dễ mở rộng sau này)
  const tabs = [
    {
      id: "results" as const,   // "as const" = giá trị cố định, không đổi
      label: "Kết quả",         // Chữ hiển thị trên tab
      icon: "🏆",               // Icon
    },
    {
      id: "upcoming" as const,
      label: "Lịch thi đấu",
      icon: "📅",
    },
  ];

  return (
    <div className="w-full">
      {/* === THANH TAB (Tab Bar) === */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-800/50 rounded-xl">
        {/*
          .map() duyệt qua mảng tabs → render 1 button cho mỗi tab
        */}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            // Khi click → setActiveTab thay đổi activeTab → re-render
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2
              py-3 px-4 rounded-lg text-sm font-semibold
              transition-all duration-300
              ${
                activeTab === tab.id
                  ? // Tab ĐANG ACTIVE → nền sáng, chữ trắng
                    "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/20"
                  : // Tab KHÔNG active → trong suốt, chữ xám
                    "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              }
            `}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* === NỘI DUNG TAB ===
          Gọi children(activeTab) = chạy hàm render do parent truyền vào
          Tùy theo activeTab, parent sẽ render nội dung khác nhau */}
      <div>{children(activeTab)}</div>
    </div>
  );
}
