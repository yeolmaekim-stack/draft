"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "오늘의 추천", icon: "🌙" },
  { href: "/team", label: "팀원 관리", icon: "🧑‍🤝‍🧑" },
  { href: "/lunch", label: "오늘 점심", icon: "🍱" },
  { href: "/log", label: "야근 식사 기록", icon: "📝" },
  { href: "/analytics", label: "분석", icon: "📊" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-xl">✦</span>
          <div className="leading-tight">
            <p className="font-display gradient-text text-[20px]">야근 메뉴 정해드림</p>
            <p className="text-[11px] tracking-wide text-[var(--text-muted)]">일만 해도 힘든데 뭐 먹을지까지 고민해야겠나요</p>
          </div>
        </Link>
        <nav className="scrollbar-thin flex gap-1.5 overflow-x-auto">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`btn btn-ghost whitespace-nowrap !px-3 !py-2 text-[13px] ${active ? "active" : ""}`}
              >
                <span>{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
