import type { DinnerLog, MenuItem, Restaurant } from "@/types";
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

export interface Badge {
  emoji: string;
  title: string;
  subtitle: string;
  earned: boolean;
}

function resolveMenuItem(
  log: DinnerLog,
  restaurantById: Map<string, Restaurant>
): MenuItem | undefined {
  const r = log.restaurantId ? restaurantById.get(log.restaurantId) : undefined;
  return r?.menus.find((m) => m.name === log.menuName);
}

// 연속 일수·인원수 카운팅 같은 뻔한 뱃지 말고, 실제 기록 패턴에서 뽑아낸
// 위트있는 뱃지들. 나이키런/당근마켓 뱃지 감성.
export function computeBadges(logs: DinnerLog[], restaurants: Restaurant[]): Badge[] {
  const restaurantById = new Map(restaurants.map((r) => [r.id, r]));
  const total = logs.length;

  if (total === 0) {
    return [
      { emoji: "🍗", title: "치킨 공화국 대통령", subtitle: "야근 식사를 기록하면 뱃지가 열려요", earned: false },
      { emoji: "🚶", title: "두 발이 배달앱", subtitle: "야근 식사를 기록하면 뱃지가 열려요", earned: false },
      { emoji: "🌙", title: "요일의 야근 정령", subtitle: "야근 식사를 기록하면 뱃지가 열려요", earned: false },
      { emoji: "🗺️", title: "강남역 지도 마스터", subtitle: "야근 식사를 기록하면 뱃지가 열려요", earned: false },
      { emoji: "🏆", title: "최애 메뉴 수호자", subtitle: "야근 식사를 기록하면 뱃지가 열려요", earned: false },
      { emoji: "🌶️", title: "혀가 마비된 자", subtitle: "야근 식사를 기록하면 뱃지가 열려요", earned: false },
      { emoji: "🥗", title: "클린 이터", subtitle: "야근 식사를 기록하면 뱃지가 열려요", earned: false },
      { emoji: "🦐", title: "오마카세 인정", subtitle: "야근 식사를 기록하면 뱃지가 열려요", earned: false },
    ];
  }

  const chickenCount = logs.filter((l) => {
    const r = l.restaurantId ? restaurantById.get(l.restaurantId) : undefined;
    return r?.tags.includes("치킨") || l.menuName.includes("치킨");
  }).length;
  const chickenRatio = chickenCount / total;
  const chickenBadge: Badge = {
    emoji: "🍗",
    title: "치킨 공화국 대통령",
    subtitle:
      chickenRatio >= 0.25
        ? `야근 식사 중 ${Math.round(chickenRatio * 100)}%가 치킨이었어요. 이쯤되면 국가 원수급`
        : "아직 치킨 득표율이 부족해요. 당선까지 조금 더",
    earned: chickenRatio >= 0.25,
  };

  const { dineIn, delivery } = modeSplit(logs);
  const dineInRatio = total ? dineIn / total : 0;
  const modeBadge: Badge =
    dineInRatio >= 0.5
      ? {
          emoji: "🚶",
          title: "두 발이 배달앱",
          subtitle: `야근 식사의 ${Math.round(dineInRatio * 100)}%를 직접 걸어서 해결했어요`,
          earned: true,
        }
      : {
          emoji: "🛵",
          title: "라이더님과 절친",
          subtitle: `야근 식사의 ${Math.round((delivery / total) * 100)}%가 배달이었어요. 라이더분이 얼굴 기억할지도`,
          earned: true,
        };

  const dow = dayOfWeekDistribution(logs);
  const topDay = dow.reduce((a, b) => (b.count > a.count ? b : a));
  const dayBadge: Badge = {
    emoji: "🌙",
    title: topDay.count > 0 ? `${topDay.label}요일의 야근 정령` : "요일의 야근 정령",
    subtitle:
      topDay.count > 0
        ? `유독 ${topDay.label}요일에 야근 식사가 몰렸어요. 무슨 요일의 저주라도 있는 걸까요`
        : "아직 요일 패턴을 찾는 중이에요",
    earned: topDay.count > 0,
  };

  const distinctRestaurants = new Set(logs.map((l) => l.restaurantName)).size;
  const mapBadge: Badge = {
    emoji: "🗺️",
    title: "강남역 지도 마스터",
    subtitle:
      distinctRestaurants >= 8
        ? `서로 다른 식당 ${distinctRestaurants}곳을 다녀왔어요. 지도 앱보다 빠삭할지도`
        : `아직 ${distinctRestaurants}곳 - 지도 앱 없이 다니는 그날까지`,
    earned: distinctRestaurants >= 8,
  };

  const topMenu = topBy(logs, "menuName", 1)[0];
  const topMenuRatio = topMenu ? topMenu.count / total : 0;
  const favoriteMenuBadge: Badge = {
    emoji: "🏆",
    title: "최애 메뉴 수호자",
    subtitle:
      topMenu && topMenuRatio >= 0.15
        ? `'${topMenu.name}'가 전체의 ${Math.round(topMenuRatio * 100)}%예요. 이건 이제 최애 인정`
        : "아직 압도적인 최애가 없어요. 골고루 사랑꾼",
    earned: topMenu ? topMenuRatio >= 0.15 : false,
  };

  const spicyCount = logs.filter((l) => resolveMenuItem(l, restaurantById)?.spicy).length;
  const spicyRatio = spicyCount / total;
  const spicyBadge: Badge = {
    emoji: "🌶️",
    title: "혀가 마비된 자",
    subtitle:
      spicyRatio >= 0.6
        ? `야근 식사 중 ${Math.round(spicyRatio * 100)}%가 매운맛이었어요. 혀가 남아있는 게 신기해요`
        : `매운맛 비중 ${Math.round(spicyRatio * 100)}% - 순교까진 갈 길이 멀어요`,
    earned: spicyRatio >= 0.6,
  };

  const lightCount = logs.filter((l) => resolveMenuItem(l, restaurantById)?.light).length;
  const lightRatio = lightCount / total;
  const lightBadge: Badge = {
    emoji: "🥗",
    title: "클린 이터",
    subtitle:
      lightRatio >= 0.45
        ? `가벼운 메뉴가 전체의 ${Math.round(lightRatio * 100)}%. 다이어트는 없지만 죄책감도 없어요`
        : `가벼운 메뉴 비중 ${Math.round(lightRatio * 100)}% - 아직은 클린하지 않아요`,
    earned: lightRatio >= 0.45,
  };

  const seafoodCount = logs.filter((l) =>
    resolveMenuItem(l, restaurantById)?.tags.includes("해산물")
  ).length;
  const seafoodRatio = seafoodCount / total;
  const seafoodBadge: Badge = {
    emoji: "🦐",
    title: "오마카세 인정",
    subtitle:
      seafoodRatio >= 0.25
        ? `해산물 메뉴가 ${Math.round(seafoodRatio * 100)}%예요. 미슐랭 심사위원 안 부럽습니다`
        : `해산물 비중 ${Math.round(seafoodRatio * 100)}% - 아직 바다와는 안 친해요`,
    earned: seafoodRatio >= 0.25,
  };

  return [
    chickenBadge,
    modeBadge,
    dayBadge,
    mapBadge,
    favoriteMenuBadge,
    spicyBadge,
    lightBadge,
    seafoodBadge,
  ];
}
