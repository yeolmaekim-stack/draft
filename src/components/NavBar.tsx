"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function IconMoon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17.5" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 20c.2-2.6 1.9-4.6 4-4.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconBowl() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M3.5 11h17a8.5 8.5 0 0 1-17 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6.5 15.5 5 20M17.5 15.5 19 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 4v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconNote() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="3.5" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 8.5h7M8.5 12.5h7M8.5 16.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 20h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const LINKS = [
  { href: "/", label: "정해줘요 저녁", Icon: IconMoon },
  { href: "/team", label: "파티원 입력창", Icon: IconPeople },
  { href: "/lunch", label: "점심에 먹은거", Icon: IconBowl },
  { href: "/log", label: "이전에 먹은거", Icon: IconNote },
  { href: "/analytics", label: "통계를 내볼까", Icon: IconChart },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-xl text-white/80">✦</span>
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
                <l.Icon />
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
