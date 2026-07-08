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

type Phase = "day" | "dusk" | "night";

function getPhase(weather: WeatherInfo): Phase {
  const now = new Date();
  if (weather.sunset) {
    const sunset = new Date(weather.sunset);
    const diffMin = (now.getTime() - sunset.getTime()) / 60000;
    if (diffMin >= -40 && diffMin <= 60) return "dusk";
    return diffMin < -40 ? "day" : "night";
  }
  const hour = now.getHours();
  if (hour >= 17 && hour < 19) return "dusk";
  if (hour >= 7 && hour < 17) return "day";
  return "night";
}

const PHASE_GRADIENT: Record<Phase, string> = {
  day: "linear-gradient(180deg, #5f9fdb 0%, #9bc9ec 55%, #dcedf7 100%)",
  dusk: "linear-gradient(180deg, #241a3f 0%, #6d3564 32%, #d9622f 62%, #f6b555 100%)",
  night: "linear-gradient(180deg, #05060f 0%, #0c1026 45%, #191333 100%)",
};

const CONDITION_TINT: Record<WeatherInfo["condition"], string> = {
  clear: "transparent",
  cloudy: "rgba(110,112,126,0.28)",
  rain: "rgba(14,18,32,0.4)",
  snow: "rgba(190,202,224,0.16)",
  thunder: "rgba(8,8,18,0.5)",
  fog: "rgba(190,190,196,0.28)",
};

export default function BackgroundScene({ weather }: { weather: WeatherInfo }) {
  const phase = getPhase(weather);
  const { condition } = weather;

  const stars = useMemo(() => {
    const rand = seededRandom(11);
    return Array.from({ length: 60 }).map((_, i) => ({
      left: `${rand() * 100}%`,
      top: `${rand() * 62}%`,
      size: rand() > 0.85 ? 2.4 : 1.3,
      delay: `${(rand() * 6).toFixed(2)}s`,
      dur: `${(2.5 + rand() * 3).toFixed(2)}s`,
      key: i,
    }));
  }, []);

  const clouds = useMemo(() => {
    const rand = seededRandom(23);
    const count = condition === "cloudy" || condition === "fog" ? 7 : condition === "rain" || condition === "thunder" ? 6 : 3;
    return Array.from({ length: count }).map((_, i) => ({
      top: `${8 + rand() * 40}%`,
      width: 140 + rand() * 180,
      opacity: 0.35 + rand() * 0.35,
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

  const showSun = phase === "day" && (condition === "clear" || condition === "cloudy");
  const showDuskSun = phase === "dusk";
  const showMoon = phase === "night" && (condition === "clear" || condition === "cloudy");
  const showStars = phase === "night" && condition !== "fog";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 transition-[background] duration-1000" style={{ background: PHASE_GRADIENT[phase] }} />
      <div className="absolute inset-0" style={{ background: CONDITION_TINT[condition] }} />

      {showStars && stars.map((s) => (
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

      {showMoon && (
        <div
          className="absolute rounded-full"
          style={{
            top: "10%",
            right: "12%",
            width: 72,
            height: 72,
            background: "radial-gradient(circle at 35% 35%, #fdfdf5, #e4e0c8 70%)",
            boxShadow: "0 0 60px 18px rgba(253,253,245,0.35)",
            animation: "float-slow 8s ease-in-out infinite",
          }}
        />
      )}

      {showSun && (
        <div
          className="absolute rounded-full"
          style={{
            top: "9%",
            right: "14%",
            width: 84,
            height: 84,
            background: "radial-gradient(circle at 35% 35%, #fff6d8, #ffd479 70%)",
            boxShadow: "0 0 90px 26px rgba(255,212,121,0.45)",
          }}
        />
      )}

      {showDuskSun && (
        <div
          className="absolute rounded-full"
          style={{
            top: "48%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 130,
            height: 130,
            background: "radial-gradient(circle at 35% 35%, #fff0c2, #ff8a3d 70%)",
            boxShadow: "0 0 120px 40px rgba(255,138,61,0.4)",
          }}
        />
      )}

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
            background: phase === "night" ? "rgba(150,150,170,0.55)" : "rgba(255,255,255,0.85)",
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
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "linear-gradient(180deg, transparent, rgba(5,5,10,0.55) 90%)" }}
      />
    </div>
  );
}
