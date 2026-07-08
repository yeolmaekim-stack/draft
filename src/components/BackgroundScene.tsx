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

// 야근 = 밤이니까 배경은 항상 깊은 밤/심해 톤으로 고정하고,
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

function DeepSeaFish({ tint, glow }: { tint: string; glow: string }) {
  return (
    <svg width="64" height="30" viewBox="0 0 64 30" fill="none">
      <path
        d="M10 15 C10 7 22 2 36 2 C46 2 54 8 54 15 C54 22 46 28 36 28 C22 28 10 23 10 15 Z"
        fill={tint}
        opacity={0.55}
      />
      <path d="M12 15 L0 4 L4 15 L0 26 Z" fill={tint} opacity={0.5} />
      <path d="M30 3 L34 -5 L40 3 Z" fill={tint} opacity={0.4} />
      <line x1="48" y1="8" x2="58" y2="2" stroke={tint} strokeWidth="1" opacity={0.5} />
      <circle cx="58" cy="2" r="2.4" fill={glow} opacity={0.9} />
    </svg>
  );
}

function Jellyfish({ tint }: { tint: string }) {
  return (
    <svg width="46" height="70" viewBox="0 0 46 70" fill="none">
      <path
        d="M23 2 C34 2 44 12 44 22 C44 27 34 29 23 29 C12 29 2 27 2 22 C2 12 12 2 23 2 Z"
        fill={tint}
        opacity={0.4}
      />
      {[8, 16, 23, 30, 38].map((x, i) => (
        <path
          key={i}
          d={`M${x} 28 Q ${x + (i % 2 === 0 ? 6 : -6)} 46 ${x} 68`}
          stroke={tint}
          strokeWidth="1.4"
          opacity={0.35}
          fill="none"
        />
      ))}
    </svg>
  );
}

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
    const hues = ["var(--blue)", "var(--purple)", "var(--pink)"];
    return Array.from({ length: 8 }).map((_, i) => ({
      left: `${8 + rand() * 84}%`,
      top: `${6 + rand() * 55}%`,
      size: 10 + rand() * 14,
      dur: `${(5 + rand() * 4).toFixed(2)}s`,
      delay: `${(rand() * 5).toFixed(2)}s`,
      hue: hues[Math.floor(rand() * hues.length)],
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

  const fish = useMemo(() => {
    const rand = seededRandom(67);
    const tints = ["#7fa8ff", "#b39dff", "#ff9ecf"];
    return Array.from({ length: 6 }).map((_, i) => ({
      top: `${30 + rand() * 62}%`,
      scale: 0.6 + rand() * 0.9,
      dur: `${(38 + rand() * 34).toFixed(0)}s`,
      delay: `-${Math.floor(rand() * 40)}s`,
      reverse: rand() > 0.5,
      tint: tints[Math.floor(rand() * tints.length)],
      glow: rand() > 0.5 ? "#ffe1f2" : "#cfe0ff",
      key: i,
    }));
  }, []);

  const jellies = useMemo(() => {
    const rand = seededRandom(83);
    const tints = ["#a78bfa", "#ff8fc7", "#6ea8ff"];
    return Array.from({ length: 3 }).map((_, i) => ({
      left: `${10 + rand() * 78}%`,
      top: `${45 + rand() * 45}%`,
      scale: 0.7 + rand() * 0.7,
      dur: `${(10 + rand() * 6).toFixed(2)}s`,
      delay: `${(rand() * 6).toFixed(2)}s`,
      tint: tints[Math.floor(rand() * tints.length)],
      key: i,
    }));
  }, []);

  const bubbles = useMemo(() => {
    const rand = seededRandom(29);
    return Array.from({ length: 26 }).map((_, i) => ({
      left: `${rand() * 100}%`,
      size: 3 + rand() * 7,
      dur: `${(9 + rand() * 10).toFixed(2)}s`,
      delay: `${(rand() * 12).toFixed(2)}s`,
      key: i,
    }));
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

      {/* 심해 느낌의 도트 그리드 텍스처 */}
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
          background: "radial-gradient(circle at 35% 35%, #f3f0ff, #b8a8ff 70%)",
          boxShadow: "0 0 70px 20px rgba(167,139,250,0.3)",
          animation: "float-slow 9s ease-in-out infinite",
        }}
      />

      {/* 심해를 헤엄치는 물고기들 */}
      {fish.map((f) => (
        <div
          key={f.key}
          className="absolute"
          style={{
            top: f.top,
            left: 0,
            width: "100%",
            animation: `${f.reverse ? "drift-reverse" : "drift"} ${f.dur} linear ${f.delay} infinite`,
            opacity: 0.8,
          }}
        >
          <div style={{ transform: `scale(${f.scale}) ${f.reverse ? "scaleX(-1)" : ""}`, width: "fit-content" }}>
            <DeepSeaFish tint={f.tint} glow={f.glow} />
          </div>
        </div>
      ))}

      {/* 두둥실 떠다니는 해파리 */}
      {jellies.map((j) => (
        <div
          key={j.key}
          className="absolute"
          style={{
            left: j.left,
            top: j.top,
            transform: `scale(${j.scale})`,
            animation: `float-slow ${j.dur} ease-in-out ${j.delay} infinite`,
          }}
        >
          <Jellyfish tint={j.tint} />
        </div>
      ))}

      {/* 위로 올라가는 기포 */}
      {bubbles.map((b) => (
        <span
          key={b.key}
          className="absolute rounded-full border border-white/25 bg-white/5"
          style={{
            left: b.left,
            bottom: 0,
            width: b.size,
            height: b.size,
            animation: `bubble-rise ${b.dur} linear ${b.delay} infinite`,
          }}
        />
      ))}

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
