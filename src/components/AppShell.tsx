"use client";

import { WeatherProvider, useWeather } from "@/lib/WeatherContext";
import BackgroundScene from "@/components/BackgroundScene";
import NavBar from "@/components/NavBar";

function Scene() {
  const weather = useWeather();
  return <BackgroundScene weather={weather} />;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <WeatherProvider>
      <Scene />
      <NavBar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
      <footer className="mx-auto w-full max-w-6xl px-4 pb-8 pt-4 text-center text-[12px] text-white/35">
        데모 사이트입니다 · 강남대로 308 기준 예시 데이터로 동작해요
      </footer>
    </WeatherProvider>
  );
}
