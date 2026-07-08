import type { DinnerLog } from "@/types";
import { addDays, startOfMonth, startOfWeek, toDateStr } from "@/lib/dates";

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function filterSince(logs: DinnerLog[], since: Date): DinnerLog[] {
  const sinceStr = toDateStr(since);
  return logs.filter((l) => l.date >= sinceStr);
}

export function weeklyStats(logs: DinnerLog[], ref = new Date()) {
  const logsThisWeek = filterSince(logs, startOfWeek(ref));
  return {
    count: logsThisWeek.length,
    avgHeadcount: Math.round(avg(logsThisWeek.map((l) => l.headcount)) * 10) / 10,
  };
}

export function monthlyStats(logs: DinnerLog[], ref = new Date()) {
  const logsThisMonth = filterSince(logs, startOfMonth(ref));
  return {
    count: logsThisMonth.length,
    avgHeadcount: Math.round(avg(logsThisMonth.map((l) => l.headcount)) * 10) / 10,
  };
}

export function topBy(logs: DinnerLog[], key: "restaurantName" | "menuName", n = 5) {
  const counts = new Map<string, number>();
  logs.forEach((l) => counts.set(l[key], (counts.get(l[key]) ?? 0) + 1));
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

export function weeklyTrend(logs: DinnerLog[], weeks = 8, ref = new Date()) {
  const out: { label: string; avgHeadcount: number; count: number }[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = addDays(startOfWeek(ref), -7 * i);
    const weekEnd = addDays(weekStart, 6);
    const startStr = toDateStr(weekStart);
    const endStr = toDateStr(weekEnd);
    const inWeek = logs.filter((l) => l.date >= startStr && l.date <= endStr);
    out.push({
      label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
      avgHeadcount: inWeek.length ? Math.round(avg(inWeek.map((l) => l.headcount)) * 10) / 10 : 0,
      count: inWeek.length,
    });
  }
  return out;
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function dayOfWeekDistribution(logs: DinnerLog[]) {
  const counts = new Array(7).fill(0);
  logs.forEach((l) => {
    const [y, m, d] = l.date.split("-").map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    counts[dow]++;
  });
  return DAY_LABELS.map((label, i) => ({ label, count: counts[i] }));
}

export function modeSplit(logs: DinnerLog[]) {
  const dineIn = logs.filter((l) => l.mode === "dine-in").length;
  const delivery = logs.filter((l) => l.mode === "delivery").length;
  return { dineIn, delivery };
}
