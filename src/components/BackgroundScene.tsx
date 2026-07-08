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

// 야근 = 밤이니까 배경은 항상 깊은 밤하늘 톤으로 고정하고,
// 날씨 컨디션만 파티클/틴트로 반영합니다. (일몰 시각에 따른 낮/노을 전환 없음)
const NIGHT_GRADIENT =
  "linear-gradient(180deg, #04030c 0%, #0d0f2b 30%, #161b3d 55%, #140f2e 78%, #0c0a1c 100%)";

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
    return Array.from({ length: 90 }).map((_, i) => ({
      left: `${rand() * 100}%`,
      top: `${rand() * 85}%`,
      size: rand() > 0.85 ? 2.6 : 1.3,
      delay: `${(rand() * 6).toFixed(2)}s`,
      dur: `${(2 + rand() * 3).toFixed(2)}s`,
      key: i,
    }));
  }, []);

  const glitter = useMemo(() => {
    const rand = seededRandom(91);
    return Array.from({ length: 22 }).map((_, i) => ({
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      size: 5 + rand() * 6,
      dur: `${(3 + rand() * 5).toFixed(2)}s`,
      delay: `${(rand() * 8).toFixed(2)}s`,
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

      {/* 은은하게 흐르는 리본 라인 - 코너 장식 */}
      <svg className="absolute left-0 top-0 h-[60%] w-[45%] opacity-30" viewBox="0 0 400 400" fill="none">
        <path
          d="M-20 0 C 60 60, 40 140, 120 180 S 240 220, 260 320"
          stroke="url(#ribbon-a)"
          strokeWidth="1.4"
          fill="none"
        />
        <defs>
          <linearGradient id="ribbon-a" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.7" />
            <stop offset="55%" stopColor="var(--purple)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--pink)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg className="absolute right-0 top-0 h-[55%] w-[40%] opacity-25" viewBox="0 0 400 400" fill="none">
        <path
          d="M420 0 C 340 50, 360 120, 290 160 S 190 210, 180 300"
          stroke="url(#ribbon-b)"
          strokeWidth="1.4"
          fill="none"
        />
        <defs>
          <linearGradient id="ribbon-b" x1="400" y1="0" x2="150" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--pink)" stopOpacity="0.6" />
            <stop offset="55%" stopColor="var(--purple)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none">
        {constellation.map((c) => (
          <line
            key={c.key}
            x1={`${c.x1}%`}
            y1={`${c.y1}%`}
            x2={`${c.x2}%`}
            y2={`${c.y2}%`}
            stroke="var(--purple)"
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

      {/* 미니멀한 글리터 반짝임 */}
      {glitter.map((g) => (
        <div key={g.key} className="absolute" style={{ left: g.left, top: g.top }}>
          <div
            className="absolute rounded-full bg-white"
            style={{
              width: g.size * 1.8,
              height: g.size * 1.8,
              left: -(g.size * 0.4),
              top: -(g.size * 0.4),
              filter: "blur(2.5px)",
              opacity: 0.5,
              animation: `glitter-halo ${g.dur} ease-in-out ${g.delay} infinite`,
            }}
          />
          <svg
            className="relative text-white"
            style={{
              width: g.size,
              height: g.size,
              animation: `glitter-flare ${g.dur} ease-in-out ${g.delay} infinite`,
            }}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      ))}

      {/* 은은한 달빛 */}
      <div
        className="absolute rounded-full"
        style={{
          top: "8%",
          right: "10%",
          width: 60,
          height: 60,
          background: "radial-gradient(circle at 35% 35%, #f3f0ff, #b8a8ff 70%)",
          boxShadow: "0 0 50px 14px rgba(167,139,250,0.22)",
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
        style={{ background: "linear-gradient(180deg, transparent, rgba(4,3,12,0.65) 100%)" }}
      />
    </div>
  );
}
