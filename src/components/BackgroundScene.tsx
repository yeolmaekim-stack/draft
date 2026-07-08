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

function TinyFish({ tint }: { tint: string }) {
  return (
    <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
      <ellipse cx="9" cy="4" rx="7" ry="3" fill={tint} />
      <path d="M2 4 L-3 1 L-3 7 Z" fill={tint} />
    </svg>
  );
}

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
    const hues = ["var(--blue)", "var(--purple)", "var(--pink)", "#ffffff"];
    return Array.from({ length: 46 }).map((_, i) => ({
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      size: 6 + rand() * 11,
      dur: `${(2.5 + rand() * 5).toFixed(2)}s`,
      delay: `${(rand() * 8).toFixed(2)}s`,
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

  const rays = useMemo(() => {
    const rand = seededRandom(59);
    return Array.from({ length: 4 }).map((_, i) => ({
      left: `${10 + rand() * 60}%`,
      width: 90 + rand() * 160,
      rotate: -18 + rand() * 30,
      dur: `${(7 + rand() * 5).toFixed(2)}s`,
      delay: `${(rand() * 4).toFixed(2)}s`,
      key: i,
    }));
  }, []);

  const fishSchool = useMemo(() => {
    const rand = seededRandom(67);
    const tints = ["rgba(110,140,210,0.5)", "rgba(140,120,200,0.45)", "rgba(160,130,190,0.4)"];
    return Array.from({ length: 18 }).map((_, i) => ({
      top: `${48 + rand() * 42}%`,
      scale: 0.5 + rand() * 0.9,
      dur: `${(70 + rand() * 60).toFixed(0)}s`,
      delay: `-${Math.floor(rand() * 60)}s`,
      reverse: rand() > 0.5,
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

      {/* 수면 위에서 쏟아지는 빛줄기 - 심해로 들어온 빛 */}
      {rays.map((r) => (
        <div
          key={r.key}
          className="absolute top-[-10%]"
          style={{
            left: r.left,
            width: r.width,
            height: "85%",
            transform: `rotate(${r.rotate}deg)`,
            transformOrigin: "top center",
            clipPath: "polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)",
            background:
              "linear-gradient(180deg, rgba(210,225,255,0.28) 0%, rgba(170,195,255,0.1) 40%, transparent 78%)",
            filter: "blur(5px)",
            mixBlendMode: "screen",
            animation: `twinkle ${r.dur} ease-in-out ${r.delay} infinite`,
          }}
        />
      ))}

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

      {/* 글리터처럼 반짝이는 스타 플레어 */}
      {glitter.map((g) => (
        <svg
          key={g.key}
          className="absolute"
          style={{
            left: g.left,
            top: g.top,
            width: g.size,
            height: g.size,
            animation: `glitter-flare ${g.dur} ease-in-out ${g.delay} infinite`,
            color: g.hue,
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

      {/* 저 아래에서 헤엄치는 작은 물고기 떼 */}
      {fishSchool.map((f) => (
        <div
          key={f.key}
          className="absolute"
          style={{
            top: f.top,
            left: 0,
            width: "100%",
            animation: `${f.reverse ? "drift-reverse" : "drift"} ${f.dur} linear ${f.delay} infinite`,
          }}
        >
          <div style={{ transform: `scale(${f.scale}) ${f.reverse ? "scaleX(-1)" : ""}`, width: "fit-content" }}>
            <TinyFish tint={f.tint} />
          </div>
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
