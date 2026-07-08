"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { WeatherInfo } from "@/types";
import { fallbackWeather, fetchWeather } from "@/lib/weather";

const WeatherCtx = createContext<WeatherInfo>(fallbackWeather());

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weather, setWeather] = useState<WeatherInfo>(fallbackWeather());

  useEffect(() => {
    let alive = true;
    fetchWeather().then((w) => {
      if (alive) setWeather(w);
    });
    const interval = setInterval(() => {
      fetchWeather().then((w) => {
        if (alive) setWeather(w);
      });
    }, 15 * 60 * 1000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  return <WeatherCtx.Provider value={weather}>{children}</WeatherCtx.Provider>;
}

export function useWeather() {
  return useContext(WeatherCtx);
}
