import type {
  DinnerLog,
  LunchRecord,
  MenuItem,
  RecommendationReason,
  RecommendationResult,
  Restaurant,
  SpecialDay,
  TeamMember,
  WeatherInfo,
} from "@/types";
import { SEED_RESTAURANTS, SEED_SPECIAL_DAYS } from "@/lib/seedData";
import { addDays, toDateStr, toMMDD } from "@/lib/dates";

export function getTodaySpecialDay(): SpecialDay | null {
  const mmdd = toMMDD(new Date());
  return SEED_SPECIAL_DAYS.find((s) => s.date === mmdd) ?? null;
}

function overlap(a: string[], b: string[]): string[] {
  return a.filter((x) => b.includes(x));
}

interface RecommendInput {
  members: TeamMember[];
  attendeeIds: string[];
  mode: "dine-in" | "delivery";
  lunchRecords: LunchRecord[];
  weather: WeatherInfo;
  dinnerLogs: DinnerLog[];
  restaurants?: Restaurant[];
  referenceDate?: Date;
}

export interface RecommendOutput {
  results: RecommendationResult[];
  specialDay: SpecialDay | null;
  excludedAlways: Restaurant[];
  attendeeCount: number;
  eligibleRestaurantCount: number;
}

export function recommend(input: RecommendInput): RecommendOutput {
  const restaurants = input.restaurants ?? SEED_RESTAURANTS;
  const referenceDate = input.referenceDate ?? new Date();
  const today = toDateStr(referenceDate);
  const attendees = input.members.filter((m) => input.attendeeIds.includes(m.id));
  const specialDay = getTodaySpecialDay();

  const excludedAlways = restaurants.filter((r) =>
    r.menus.every((mn) => mn.isGrilled || mn.isAlcohol)
  );

  const recentCutoff = toDateStr(addDays(referenceDate, -3));
  const historyCutoff = toDateStr(addDays(referenceDate, -60));

  const todayLunchTexts = input.lunchRecords
    .filter((l) => l.date === today && attendees.some((a) => a.id === l.memberId))
    .map((l) => l.menu.trim())
    .filter(Boolean);

  const recentRestaurantIds = new Set(
    input.dinnerLogs
      .filter((l) => l.date >= recentCutoff && l.date <= today && l.restaurantId)
      .map((l) => l.restaurantId as string)
  );

  const popularityByRestaurant = new Map<string, number>();
  const popularityByMenu = new Map<string, number>();
  input.dinnerLogs
    .filter((l) => l.date >= historyCutoff)
    .forEach((l) => {
      if (l.restaurantId) {
        popularityByRestaurant.set(
          l.restaurantId,
          (popularityByRestaurant.get(l.restaurantId) ?? 0) + 1
        );
      }
      const key = `${l.restaurantId}::${l.menuName}`;
      popularityByMenu.set(key, (popularityByMenu.get(key) ?? 0) + 1);
    });

  let candidateRestaurants = restaurants.filter((r) =>
    input.mode === "delivery" ? r.deliveryAvailable : r.dineInAvailable
  );
  if (input.mode === "dine-in" && attendees.length > 0) {
    candidateRestaurants = candidateRestaurants.filter(
      (r) => r.maxPartySize >= attendees.length
    );
  }

  const results: RecommendationResult[] = [];

  for (const restaurant of candidateRestaurants) {
    let bestMenu: MenuItem | null = null;
    let bestScore = -Infinity;
    let bestReasons: { weight: number; reason: RecommendationReason }[] = [];

    for (const menu of restaurant.menus) {
      // 야근엔 고기 구이·술은 절대 없다
      if (menu.isGrilled || menu.isAlcohol) continue;

      // 알러지/절대 못 먹는 것 - 하드 제외
      const hardBlocked = attendees.some((a) => {
        const blocked = overlap(a.cannotEat, [...menu.tags, ...restaurant.tags]);
        return blocked.length > 0;
      });
      if (hardBlocked) continue;

      let score = 10;
      const reasons: { weight: number; reason: RecommendationReason }[] = [];

      // 거리/시간 - 모드에 따라 가까울수록 유리
      if (input.mode === "dine-in") {
        score -= restaurant.walkMinutes * 1.1;
        if (restaurant.walkMinutes <= 4) {
          score += 3;
          reasons.push({ weight: 3, reason: { emoji: "🚶", text: "사무실에서 가까움" } });
        }
      } else {
        score -= restaurant.deliveryMinutes * 0.35;
        if (restaurant.deliveryMinutes <= 22) {
          score += 3;
          reasons.push({ weight: 3, reason: { emoji: "🛵", text: "배달이 빠른 편" } });
        }
      }

      // 팀원 선호도
      for (const a of attendees) {
        const likedHits = overlap(a.likes, menu.tags);
        if (likedHits.length > 0) {
          score += 4 * likedHits.length;
          reasons.push({
            weight: 4 * likedHits.length,
            reason: { emoji: a.emoji, text: `${a.name}이(가) 좋아하는 ${likedHits[0]}` },
          });
        }
        const dislikedHits = overlap(a.dislikes, menu.tags);
        if (dislikedHits.length > 0) {
          score -= 4 * dislikedHits.length;
        }
      }

      // 오늘 점심과 겹치지 않게
      const lunchDup = todayLunchTexts.some(
        (l) => menu.name.includes(l) || l.includes(menu.name)
      );
      if (lunchDup) {
        score -= 8;
      } else if (todayLunchTexts.length > 0) {
        score += 1;
      }

      // 날씨
      if (["rain", "snow", "thunder"].includes(input.weather.condition) && menu.soupy) {
        score += 4;
        reasons.push({
          weight: 4,
          reason: {
            emoji: input.weather.condition === "rain" ? "🌧️" : input.weather.condition === "snow" ? "❄️" : "⛈️",
            text: "궂은 날씨엔 뜨끈한 국물",
          },
        });
      }
      if (input.weather.condition === "clear" && input.weather.temperature >= 28 && menu.light) {
        score += 3;
        reasons.push({ weight: 3, reason: { emoji: "🥵", text: "더운 날엔 가볍게" } });
      }
      if (input.weather.temperature <= 5 && menu.soupy) {
        score += 3;
        reasons.push({ weight: 3, reason: { emoji: "🥶", text: "추운 날엔 따뜻한 한 그릇" } });
      }

      // 기념일
      if (specialDay) {
        const hit = overlap(specialDay.boostTags, menu.tags);
        if (hit.length > 0) {
          score += 6;
          reasons.push({
            weight: 6,
            reason: { emoji: specialDay.emoji, text: `${specialDay.label}엔 ${hit[0]}` },
          });
        }
      }

      // 인기도 (최근 60일)
      const popRestaurant = popularityByRestaurant.get(restaurant.id) ?? 0;
      const popMenu = popularityByMenu.get(`${restaurant.id}::${menu.name}`) ?? 0;
      if (popMenu > 0) {
        const bonus = Math.min(popMenu * 1, 3);
        score += bonus;
        reasons.push({ weight: bonus, reason: { emoji: "📈", text: "우리 팀 단골 메뉴" } });
      } else if (popRestaurant > 0) {
        const bonus = Math.min(popRestaurant * 0.5, 2);
        score += bonus;
      }

      // 최근 3일 내 다녀온 곳은 변화를 위해 감점
      if (recentRestaurantIds.has(restaurant.id)) {
        score -= 3;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMenu = menu;
        bestReasons = reasons;
      }
    }

    if (bestMenu) {
      const sortedReasons = bestReasons
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3)
        .map((r) => r.reason);
      results.push({
        restaurant,
        menu: bestMenu,
        score: bestScore,
        reasons: sortedReasons,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  return {
    results: results.slice(0, 5),
    specialDay,
    excludedAlways,
    attendeeCount: attendees.length,
    eligibleRestaurantCount: candidateRestaurants.length,
  };
}
