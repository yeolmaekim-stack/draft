import type { WeatherCondition, WeatherInfo } from "@/types";
import { OFFICE_LOCATION } from "@/lib/seedData";

function codeToCondition(code: number): WeatherCondition {
  if ([0, 1].includes(code)) return "clear";
  if ([2, 3].includes(code)) return "cloudy";
  if ([45, 48].includes(code)) return "fog";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "thunder";
  return "cloudy";
}

export function fallbackWeather(): WeatherInfo {
  const hour = new Date().getHours();
  return {
    condition: "clear",
    temperature: 24,
    isDay: hour >= 7 && hour < 19,
    sunset: null,
    source: "fallback",
  };
}

export async function fetchWeather(): Promise<WeatherInfo> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${OFFICE_LOCATION.lat}&longitude=${OFFICE_LOCATION.lng}&current=temperature_2m,weather_code,is_day&daily=sunset&timezone=Asia%2FSeoul`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("weather fetch failed");
    const data = await res.json();
    const code = data?.current?.weather_code ?? 0;
    const sunset = data?.daily?.sunset?.[0] ?? null;
    return {
      condition: codeToCondition(code),
      temperature: data?.current?.temperature_2m ?? 24,
      isDay: data?.current?.is_day === 1,
      sunset,
      source: "live",
    };
  } catch {
    return fallbackWeather();
  }
}

export const WEATHER_LABEL: Record<WeatherCondition, string> = {
  clear: "맑음",
  cloudy: "흐림",
  rain: "비",
  snow: "눈",
  thunder: "뇌우",
  fog: "안개",
};

export const WEATHER_EMOJI: Record<WeatherCondition, string> = {
  clear: "☀️",
  cloudy: "☁️",
  rain: "🌧️",
  snow: "❄️",
  thunder: "⛈️",
  fog: "🌫️",
};
