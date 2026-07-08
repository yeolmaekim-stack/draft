"use client";

import { useStore } from "@/lib/store";

export default function Hydrated({ children }: { children: React.ReactNode }) {
  const hasHydrated = useStore((s) => s.hasHydrated);
  if (!hasHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-white/40">
        불러오는 중…
      </div>
    );
  }
  return <>{children}</>;
}
