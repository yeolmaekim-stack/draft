"use client";

import { useMemo } from "react";
import type { WeatherInfo } from "@/types";

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// 야근 = 밤이니까 배경은 항상 깊은 밤(우주/심해) 톤으로 고정하고,
// 날씨 컨디션만 파티클/틴트로 반영합니다. (일몰 시각에 따른 낮/노을 전환 없음)
const NIGHT_GRADIENT =
  "linear-gradient(180deg, #05040d 0%, #120f28 32%, #251a3d 60%, #1a1024 82%, #120a16 100%)";

const CONDITION_TINT: Record<WeatherInfo["condition"], string> = {
  clear: "transparent",
  cloudy: "rgba(110,112,140,0.22)",
  rain: "rgba(10,14,32,0.4)",
  snow: "rgba(190,202,224,0.14)",
  thunder: "rgba(6,6,20,0.5)",
  fog: "rgba(160,160,190,0.22)",
};

export default function BackgroundScene({ weather }: { weather: WeatherInfo }) {
  const { condition } = weather;

  const stars = useMemo(() => {
    const rand = seededRandom(11);
    return Array.from({ length: 70 }).map((_, i) => ({
      left: `${rand() * 100}%`,
      top: `${rand() * 78}%`,
      size: rand() > 0.85 ? 2.6 : 1.3,
      delay: `${(rand() * 6).toFixed(2)}s`,
      dur: `${(2.5 + rand() * 3).toFixed(2)}s`,
      key: i,
    }));
  }, []);

  const sparkles = useMemo(() => {
    const rand = seededRandom(91);
    return Array.from({ length: 8 }).map((_, i) => ({
      left: `${8 + rand() * 84}%`,
      top: `${6 + rand() * 55}%`,
      size: 10 + rand() * 14,
      dur: `${(5 + rand() * 4).toFixed(2)}s`,
      delay: `${(rand() * 5).toFixed(2)}s`,
      hue: rand() > 0.5 ? "var(--gold)" : "var(--pink)",
      key: i,
    }));
  }, []);

  const constellation = useMemo(() => {
    const rand = seededRandom(41);
    return Array.from({ length: 4 }).map((_, i) => {
      const x1 = rand() * 100;
      const y1 = rand() * 45;
      return {
        x1,
        y1,
        x2: Math.min(100, Math.max(0, x1 + (rand() - 0.5) * 30)),
        y2: Math.min(60, Math.max(0, y1 + (rand() - 0.5) * 20)),
        key: i,
      };
    });
  }, []);

  const clouds = useMemo(() => {
    const rand = seededRandom(23);
    const count = condition === "cloudy" || condition === "fog" ? 6 : condition === "rain" || condition === "thunder" ? 5 : 0;
    return Array.from({ length: count }).map((_, i) => ({
      top: `${8 + rand() * 40}%`,
      width: 140 + rand() * 180,
      opacity: 0.22 + rand() * 0.22,
      dur: `${50 + rand() * 60}s`,
      delay: `-${Math.floor(rand() * 40)}s`,
      key: i,
    }));
  }, [condition]);

  const drops = useMemo(() => {
    if (condition !== "rain" && condition !== "thunder") return [];
    const rand = seededRandom(37);
    return Array.from({ length: 70 }).map((_, i) => ({
      left: `${rand() * 100}%`,
      dur: `${(0.5 + rand() * 0.5).toFixed(2)}s`,
      delay: `${(rand() * 2).toFixed(2)}s`,
      height: 14 + rand() * 16,
      key: i,
    }));
  }, [condition]);

  const flakes = useMemo(() => {
    if (condition !== "snow") return [];
    const rand = seededRandom(53);
    return Array.from({ length: 45 }).map((_, i) => ({
      left: `${rand() * 100}%`,
      dur: `${(4 + rand() * 5).toFixed(2)}s`,
      delay: `${(rand() * 5).toFixed(2)}s`,
      size: 3 + rand() * 4,
      key: i,
    }));
  }, [condition]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ background: NIGHT_GRADIENT }} />
      <div className="absolute inset-0" style={{ background: CONDITION_TINT[condition] }} />

      {/* 심해/네트워크 느낌의 도트 그리드 텍스처 */}
      <div
        className="dot-grid absolute inset-x-0 bottom-0 h-2/3"
        style={{ maskImage: "linear-gradient(180deg, transparent, black 40%)", opacity: 0.5 }}
      />

      <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none">
        {constellation.map((c) => (
          <line
            key={c.key}
            x1={`${c.x1}%`}
            y1={`${c.y1}%`}
            x2={`${c.x2}%`}
            y2={`${c.y2}%`}
            stroke="var(--gold)"
            strokeWidth={1}
            strokeDasharray="2 5"
          />
        ))}
      </svg>

      {stars.map((s) => (
        <span
          key={s.key}
          className="absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.dur} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      {sparkles.map((s) => (
        <svg
          key={s.key}
          className="absolute"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.dur} ease-in-out ${s.delay} infinite, spin-slow 18s linear infinite`,
            color: s.hue,
          }}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"
            fill="currentColor"
          />
        </svg>
      ))}

      {/* 항상 떠 있는 달 - 야근은 늘 밤이니까 */}
      <div
        className="absolute rounded-full"
        style={{
          top: "8%",
          right: "10%",
          width: 76,
          height: 76,
          background: "radial-gradient(circle at 35% 35%, #fffaf0, #f5d78e 70%)",
          boxShadow: "0 0 70px 20px rgba(245,215,142,0.3)",
          animation: "float-slow 9s ease-in-out infinite",
        }}
      />

      {clouds.map((c) => (
        <div
          key={c.key}
          className="absolute rounded-full blur-xl"
          style={{
            top: c.top,
            width: c.width,
            height: c.width * 0.34,
            left: 0,
            opacity: c.opacity,
            background: "rgba(180,170,210,0.5)",
            animation: `drift ${c.dur} linear ${c.delay} infinite`,
          }}
        />
      ))}

      {drops.map((d) => (
        <span
          key={d.key}
          className="absolute w-px rounded-full"
          style={{
            left: d.left,
            top: 0,
            height: d.height,
            background: "linear-gradient(180deg, transparent, rgba(190,220,255,0.75))",
            animation: `rain-fall ${d.dur} linear ${d.delay} infinite`,
          }}
        />
      ))}

      {flakes.map((f) => (
        <span
          key={f.key}
          className="absolute rounded-full bg-white/80"
          style={{
            left: f.left,
            top: 0,
            width: f.size,
            height: f.size,
            animation: `rain-fall ${f.dur} linear ${f.delay} infinite`,
          }}
        />
      ))}

      {condition === "thunder" && (
        <div
          className="absolute inset-0 bg-white"
          style={{ animation: "twinkle 9s ease-in-out infinite", opacity: 0 }}
        />
      )}

      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: "linear-gradient(180deg, transparent, rgba(5,4,13,0.6) 100%)" }}
      />
    </div>
  );
}
