"use client";

import { useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import { useWeather } from "@/lib/WeatherContext";
import { recommend, getTodaySpecialDay } from "@/lib/recommend";
import { WEATHER_EMOJI, WEATHER_LABEL } from "@/lib/weather";
import { formatKoreanDate, todayStr } from "@/lib/dates";
import Hydrated from "@/components/Hydrated";
import MenuImage from "@/components/MenuImage";
import type { MapPin } from "@/components/MapView";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-white/40">지도 불러오는 중…</div>
  ),
});

function HomeContent() {
  const members = useStore((s) => s.members);
  const tonight = useStore((s) => s.tonight);
  const toggleAttendee = useStore((s) => s.toggleAttendee);
  const setAllAttendees = useStore((s) => s.setAllAttendees);
  const setMode = useStore((s) => s.setMode);
  const lunchRecords = useStore((s) => s.lunchRecords);
  const dinnerLogs = useStore((s) => s.dinnerLogs);
  const weather = useWeather();

  const todayLunchCount = useMemo(
    () => lunchRecords.filter((l) => l.date === todayStr()).length,
    [lunchRecords]
  );

  const output = useMemo(
    () =>
      recommend({
        members,
        attendeeIds: tonight.attendeeIds,
        mode: tonight.mode,
        lunchRecords,
        weather,
        dinnerLogs,
      }),
    [members, tonight, lunchRecords, weather, dinnerLogs]
  );

  const specialDay = getTodaySpecialDay();

  const pins: MapPin[] = output.results.map((r, i) => ({
    id: r.restaurant.id,
    name: r.restaurant.name,
    lat: r.restaurant.lat,
    lng: r.restaurant.lng,
    emoji: r.menu.emoji,
    subtitle: `${r.menu.name} · ${r.menu.price.toLocaleString()}원`,
    rank: i + 1,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
        <div className="card flex flex-col justify-center gap-2 p-6">
          <p className="text-sm text-white/50">{formatKoreanDate(todayStr())}</p>
          <h1 className="text-2xl font-bold sm:text-3xl">오늘 야근, 뭐 먹지? 🌙</h1>
          <p className="text-sm text-white/60">
            일만 해도 힘든데 뭐 먹을지까지 고민해야겠냐 — 인원·취향·날씨·오늘의 기념일까지 반영해서 top5를 골라드려요.
          </p>
          {specialDay && (
            <span className="tag mt-1 w-fit !border-[var(--accent)] !text-[var(--accent)]">
              {specialDay.emoji} 오늘은 {specialDay.label}
            </span>
          )}
        </div>
        <div className="card flex flex-col justify-center gap-2 p-6">
          <p className="text-sm text-white/50">사무실 실시간 날씨 · 강남대로 308</p>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{WEATHER_EMOJI[weather.condition]}</span>
            <div>
              <p className="text-xl font-bold">
                {WEATHER_LABEL[weather.condition]} · {Math.round(weather.temperature)}°C
              </p>
              <p className="text-xs text-white/45">
                {weather.source === "live" ? "실시간 날씨 반영 중" : "날씨 정보를 불러오지 못해 기본값으로 표시 중"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card flex flex-col gap-5 p-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-white/80">
              오늘 야근하는 사람 ({tonight.attendeeIds.length}명)
            </p>
            <div className="flex gap-1.5">
              <button
                className="btn btn-ghost !px-2.5 !py-1 text-[12px]"
                onClick={() => setAllAttendees(members.map((m) => m.id))}
              >
                전체 선택
              </button>
              <button className="btn btn-ghost !px-2.5 !py-1 text-[12px]" onClick={() => setAllAttendees([])}>
                전체 해제
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {members.map((m) => {
              const active = tonight.attendeeIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleAttendee(m.id)}
                  className={`btn ${active ? "btn-primary" : "btn-ghost"} !px-3 !py-1.5 text-[13px]`}
                >
                  <span>{m.emoji}</span>
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-white/80">오늘은 어떻게 먹나요?</p>
          <div className="flex gap-2">
            <button
              className={`btn ${tonight.mode === "dine-in" ? "btn-primary" : "btn-ghost"} !px-4`}
              onClick={() => setMode("dine-in")}
            >
              🚶 가서 먹기 (도보)
            </button>
            <button
              className={`btn ${tonight.mode === "delivery" ? "btn-primary" : "btn-ghost"} !px-4`}
              onClick={() => setMode("delivery")}
            >
              🛵 배달시켜 먹기
            </button>
          </div>
        </div>

        <p className="text-xs text-white/40">
          오늘 점심 기록 {todayLunchCount}명 입력됨 — 점심이랑 안 겹치게 추천에 반영돼요.{" "}
          <Link href="/lunch" className="underline hover:text-white/70">
            점심 기록하러 가기
          </Link>
        </p>

        {output.excludedAlways.length > 0 && (
          <p className="text-xs text-white/35">
            🚫 야근엔 고기 구이·술은 없다는 원칙에 따라 항상 제외: {output.excludedAlways.map((r) => r.name).join(", ")}
          </p>
        )}
      </div>

      {/* Results */}
      {tonight.attendeeIds.length === 0 ? (
        <div className="card p-10 text-center text-white/50">오늘 야근하는 사람을 먼저 선택해주세요 🙋</div>
      ) : output.results.length === 0 ? (
        <div className="card p-10 text-center text-white/50">
          조건에 맞는 식당이 없어요. 인원수나 모드를 바꿔보세요 (도보 방문은 좌석 인원 제한이 있어요).
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {output.results.map((r, i) => (
              <div key={r.restaurant.id} className="card flex flex-col gap-3 overflow-hidden p-4">
                <div className="relative">
                  <MenuImage emoji={r.menu.emoji} gradient={r.menu.gradient} />
                  <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-sm font-bold text-[var(--accent)] backdrop-blur">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold">{r.restaurant.name}</p>
                      <p className="text-xs text-white/45">{r.restaurant.category}</p>
                    </div>
                    <p className="whitespace-nowrap text-xs text-white/50">
                      {tonight.mode === "dine-in"
                        ? `🚶 도보 ${r.restaurant.walkMinutes}분`
                        : `🛵 배달 약 ${r.restaurant.deliveryMinutes}분`}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                    <span className="text-sm font-medium">{r.menu.name}</span>
                    <span className="text-sm font-bold text-[var(--accent)]">
                      {r.menu.price.toLocaleString()}원
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.reasons.map((reason, idx) => (
                    <span key={idx} className="tag">
                      {reason.emoji} {reason.text}
                    </span>
                  ))}
                </div>
                <p className="mt-auto text-[11px] text-white/35">📍 {r.restaurant.address}</p>
              </div>
            ))}
          </div>

          <div className="card overflow-hidden p-2">
            <p className="px-3 pb-2 pt-1 text-sm font-semibold text-white/80">📍 추천 식당 지도</p>
            <div className="h-80 overflow-hidden rounded-2xl">
              <MapView pins={pins} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Hydrated>
      <HomeContent />
    </Hydrated>
  );
}
