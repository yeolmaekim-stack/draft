"use client";

import { useStore } from "@/lib/store";
import Hydrated from "@/components/Hydrated";
import { formatKoreanDate, todayStr } from "@/lib/dates";

function LunchContent() {
  const members = useStore((s) => s.members);
  const lunchRecords = useStore((s) => s.lunchRecords);
  const setLunch = useStore((s) => s.setLunch);
  const removeLunch = useStore((s) => s.removeLunch);

  const today = todayStr();
  const todayRecords = lunchRecords.filter((r) => r.date === today);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="eyebrow mb-2 w-fit">✦ lunch check</span>
        <h1 className="font-display gradient-text text-2xl italic font-black sm:text-3xl">오늘 점심 뭐 드셨어요?</h1>
        <p className="mt-1 text-sm text-white/55">
          {formatKoreanDate(today)} · 점심에 먹은 메뉴는 오늘 야근 메뉴 추천에서 자동으로 피해드려요.
        </p>
      </div>

      <div className="card divide-y divide-white/10 p-2">
        {members.map((m) => {
          const record = todayRecords.find((r) => r.memberId === m.id);
          return (
            <div key={m.id} className="flex items-center gap-3 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-lg">
                {m.emoji}
              </span>
              <p className="w-20 shrink-0 text-sm font-medium">{m.name}</p>
              <input
                className="input"
                placeholder="점심 메뉴 입력 (예: 제육볶음)"
                defaultValue={record?.menu ?? ""}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v) setLunch(m.id, v);
                  else if (record) removeLunch(record.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                }}
              />
              {record && (
                <button
                  className="btn btn-ghost !px-2.5 !py-1.5 text-[12px] hover:!border-red-400 hover:!text-red-300"
                  onClick={() => removeLunch(record.id)}
                >
                  지우기
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-white/35">
        {todayRecords.length}/{members.length}명 기록 완료
      </p>
    </div>
  );
}

export default function LunchPage() {
  return (
    <Hydrated>
      <LunchContent />
    </Hydrated>
  );
}
