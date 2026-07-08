"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import Hydrated from "@/components/Hydrated";
import { SEED_RESTAURANTS } from "@/lib/seedData";
import { formatKoreanDate, todayStr } from "@/lib/dates";

function LogForm() {
  const members = useStore((s) => s.members);
  const addDinnerLog = useStore((s) => s.addDinnerLog);

  const [date, setDate] = useState(todayStr());
  const [restaurantChoice, setRestaurantChoice] = useState(SEED_RESTAURANTS[0].id);
  const [customName, setCustomName] = useState("");
  const [menuName, setMenuName] = useState("");
  const [mode, setMode] = useState<"dine-in" | "delivery">("dine-in");
  const [attendeeIds, setAttendeeIds] = useState<string[]>(members.map((m) => m.id));

  const selectedRestaurant = SEED_RESTAURANTS.find((r) => r.id === restaurantChoice) ?? null;

  function toggleAttendee(id: string) {
    setAttendeeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function submit() {
    const restaurantName = restaurantChoice === "custom" ? customName.trim() : selectedRestaurant?.name ?? "";
    if (!restaurantName || !menuName.trim() || attendeeIds.length === 0) return;
    addDinnerLog({
      date,
      restaurantId: restaurantChoice === "custom" ? null : restaurantChoice,
      restaurantName,
      menuName: menuName.trim(),
      headcount: attendeeIds.length,
      memberIds: attendeeIds,
      mode,
    });
    setMenuName("");
    setCustomName("");
  }

  return (
    <div className="card flex flex-col gap-4 p-5">
      <p className="text-sm font-semibold text-white/80">+ 오늘 실제로 먹은 야근 메뉴 기록하기</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[12px] text-white/50">날짜</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-[12px] text-white/50">방식</label>
          <div className="flex gap-2">
            <button
              className={`btn ${mode === "dine-in" ? "btn-primary" : "btn-ghost"} flex-1 !py-1.5 text-[13px]`}
              onClick={() => setMode("dine-in")}
            >
              🚶 가서 먹음
            </button>
            <button
              className={`btn ${mode === "delivery" ? "btn-primary" : "btn-ghost"} flex-1 !py-1.5 text-[13px]`}
              onClick={() => setMode("delivery")}
            >
              🛵 배달
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[12px] text-white/50">식당</label>
          <select
            className="input"
            value={restaurantChoice}
            onChange={(e) => setRestaurantChoice(e.target.value)}
          >
            {SEED_RESTAURANTS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
            <option value="custom">직접 입력…</option>
          </select>
          {restaurantChoice === "custom" && (
            <input
              className="input mt-2"
              placeholder="식당 이름 입력"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          )}
        </div>
        <div>
          <label className="mb-1 block text-[12px] text-white/50">메뉴</label>
          <input
            className="input"
            list="menu-suggestions"
            placeholder="예: 순대국밥"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
          />
          <datalist id="menu-suggestions">
            {selectedRestaurant?.menus.map((mn) => <option key={mn.id} value={mn.name} />)}
          </datalist>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[12px] text-white/50">함께 먹은 사람 ({attendeeIds.length}명)</p>
        <div className="flex flex-wrap gap-1.5">
          {members.map((m) => {
            const active = attendeeIds.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleAttendee(m.id)}
                className={`btn ${active ? "btn-primary" : "btn-ghost"} !px-2.5 !py-1 text-[12px]`}
              >
                {m.emoji} {m.name}
              </button>
            );
          })}
        </div>
      </div>

      <button className="btn btn-primary self-start !px-5" onClick={submit}>
        기록 저장
      </button>
    </div>
  );
}

function LogContent() {
  const members = useStore((s) => s.members);
  const dinnerLogs = useStore((s) => s.dinnerLogs);
  const removeDinnerLog = useStore((s) => s.removeDinnerLog);

  const memberMap = useMemo(() => new Map(members.map((m) => [m.id, m])), [members]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">야근 식사 기록 📝</h1>
        <p className="mt-1 text-sm text-white/55">
          추천이랑 상관없이 실제로 뭘 먹었는지 기록해두면, 분석 탭에서 통계로 보여드리고 다음 추천에도 반영돼요.
        </p>
      </div>

      <LogForm />

      <div className="flex flex-col gap-2">
        {dinnerLogs.length === 0 && (
          <div className="card p-8 text-center text-white/40">아직 기록이 없어요.</div>
        )}
        {dinnerLogs.map((log) => (
          <div key={log.id} className="card flex flex-wrap items-center gap-3 p-4">
            <span className="w-24 shrink-0 text-xs text-white/45">{formatKoreanDate(log.date)}</span>
            <span className="font-semibold">{log.restaurantName}</span>
            <span className="text-white/40">·</span>
            <span className="text-sm text-white/70">{log.menuName}</span>
            <span className="tag">{log.mode === "dine-in" ? "🚶 가서 먹음" : "🛵 배달"}</span>
            <span className="tag">👥 {log.headcount}명</span>
            <div className="flex -space-x-1.5">
              {log.memberIds.map((id) => (
                <span
                  key={id}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-black/40 bg-white/10 text-xs"
                  title={memberMap.get(id)?.name}
                >
                  {memberMap.get(id)?.emoji ?? "👤"}
                </span>
              ))}
            </div>
            <button
              className="btn btn-ghost ml-auto !px-2.5 !py-1 text-[12px] hover:!border-red-400 hover:!text-red-300"
              onClick={() => removeDinnerLog(log.id)}
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LogPage() {
  return (
    <Hydrated>
      <LogContent />
    </Hydrated>
  );
}
