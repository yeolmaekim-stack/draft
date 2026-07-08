import type {
  DinnerLog,
  LunchRecord,
  MenuItem,
  Restaurant,
  SpecialDay,
  TeamMember,
} from "@/types";
import { addDays, startOfWeek, toDateStr, todayStr } from "@/lib/dates";

// 사무실 기준 위치: 강남대로 308 (강남역 인근)
export const OFFICE_LOCATION = {
  name: "강남대로 308",
  lat: 37.4979,
  lng: 127.0276,
};

export const SEED_MEMBERS: TeamMember[] = [
  {
    id: "m1",
    name: "김지훈",
    emoji: "🦊",
    color: "#eb6834",
    likes: ["매운거", "국물"],
    dislikes: ["오이"],
    cannotEat: [],
  },
  {
    id: "m2",
    name: "박서연",
    emoji: "🐰",
    color: "#e87ba4",
    likes: ["해산물", "초밥"],
    dislikes: ["내장"],
    cannotEat: ["갑각류"],
  },
  {
    id: "m3",
    name: "이도윤",
    emoji: "🐻",
    color: "#4a3aa7",
    likes: ["고기", "국물", "밥류"],
    dislikes: ["마라"],
    cannotEat: [],
  },
  {
    id: "m4",
    name: "최유나",
    emoji: "🐱",
    color: "#1baf7a",
    likes: ["가벼운거", "채소"],
    dislikes: ["기름진거"],
    cannotEat: ["오이"],
  },
  {
    id: "m5",
    name: "정민재",
    emoji: "🐶",
    color: "#eda100",
    likes: ["치킨", "매운거"],
    dislikes: ["파스타"],
    cannotEat: [],
  },
  {
    id: "m6",
    name: "한소율",
    emoji: "🐼",
    color: "#2a78d6",
    likes: ["국물", "따뜻한거"],
    dislikes: ["매운거"],
    cannotEat: ["고수"],
  },
];

function menu(
  id: string,
  name: string,
  price: number,
  tags: string[],
  emoji: string,
  gradient: [string, string],
  extra: Partial<MenuItem> = {}
): MenuItem {
  return { id, name, price, tags, emoji, gradient, ...extra };
}

export const SEED_RESTAURANTS: Restaurant[] = [
  {
    id: "r1",
    name: "강남 진한국밥",
    category: "국밥",
    lat: 37.4991,
    lng: 127.0268,
    address: "강남대로 320 1층",
    walkMinutes: 4,
    deliveryMinutes: 25,
    deliveryAvailable: true,
    maxPartySize: 20,
    tags: ["국물", "돼지고기", "따뜻한거", "밥류"],
    menus: [
      menu("r1-1", "순대국밥", 9000, ["국물", "돼지고기", "따뜻한거"], "🍲", ["#eda100", "#c98500"], { soupy: true }),
      menu("r1-2", "내장탕", 10000, ["국물", "내장", "따뜻한거"], "🍜", ["#eb6834", "#d95926"], { soupy: true }),
      menu("r1-3", "삼계탕", 15000, ["보양식", "닭고기", "따뜻한거"], "🍗", ["#eda100", "#eb6834"], { soupy: true }),
    ],
  },
  {
    id: "r2",
    name: "마라향궁",
    category: "마라탕",
    lat: 37.4968,
    lng: 127.0293,
    address: "테헤란로 4길 12",
    walkMinutes: 6,
    deliveryMinutes: 30,
    deliveryAvailable: true,
    maxPartySize: 12,
    tags: ["매운거", "마라", "면요리"],
    menus: [
      menu("r2-1", "마라탕(중)", 12000, ["매운거", "마라", "국물"], "🌶️", ["#e34948", "#e66767"], { spicy: true, soupy: true }),
      menu("r2-2", "마라샹궈", 15000, ["매운거", "마라", "고기"], "🔥", ["#e34948", "#eb6834"], { spicy: true }),
    ],
  },
  {
    id: "r3",
    name: "김밥천국 강남점",
    category: "분식",
    lat: 37.4985,
    lng: 127.0261,
    address: "강남대로 302",
    walkMinutes: 3,
    deliveryMinutes: 20,
    deliveryAvailable: true,
    maxPartySize: 15,
    tags: ["분식", "매운거", "밥류"],
    menus: [
      menu("r3-1", "떡볶이", 4500, ["매운거", "분식"], "🍢", ["#e34948", "#e87ba4"], { spicy: true }),
      menu("r3-2", "참치김밥", 3500, ["밥류", "가벼운거"], "🍙", ["#1baf7a", "#199e70"], { light: true }),
      menu("r3-3", "라면", 4000, ["국물", "매운거"], "🍜", ["#eda100", "#e34948"], { soupy: true, spicy: true }),
    ],
  },
  {
    id: "r4",
    name: "스시코우지",
    category: "초밥/일식",
    lat: 37.4972,
    lng: 127.0301,
    address: "테헤란로 8길 21",
    walkMinutes: 8,
    deliveryMinutes: 35,
    deliveryAvailable: true,
    maxPartySize: 10,
    tags: ["해산물", "초밥", "가벼운거"],
    menus: [
      menu("r4-1", "모둠초밥", 18000, ["해산물", "초밥", "갑각류"], "🍣", ["#2a78d6", "#3987e5"], {}),
      menu("r4-2", "연어덮밥", 13000, ["해산물", "밥류"], "🐟", ["#2a78d6", "#1baf7a"], {}),
    ],
  },
  {
    id: "r5",
    name: "우동나라",
    category: "일식/면",
    lat: 37.4988,
    lng: 127.0288,
    address: "강남대로 98길 5",
    walkMinutes: 5,
    deliveryMinutes: 25,
    deliveryAvailable: true,
    maxPartySize: 18,
    tags: ["면요리", "국물", "따뜻한거"],
    menus: [
      menu("r5-1", "가케우동", 8000, ["면요리", "국물", "가벼운거"], "🍥", ["#eda100", "#c98500"], { soupy: true, light: true }),
      menu("r5-2", "카레우동", 9500, ["면요리", "국물"], "🍛", ["#eda100", "#eb6834"], { soupy: true }),
    ],
  },
  {
    id: "r6",
    name: "강남 파스타공방",
    category: "양식",
    lat: 37.4965,
    lng: 127.0269,
    address: "강남대로 60길 11",
    walkMinutes: 7,
    deliveryMinutes: 30,
    deliveryAvailable: true,
    maxPartySize: 14,
    tags: ["면요리", "느끼한거"],
    menus: [
      menu("r6-1", "로제파스타", 14000, ["면요리", "느끼한거"], "🍝", ["#e87ba4", "#d55181"], {}),
      menu("r6-2", "알리오올리오", 13000, ["면요리"], "🍝", ["#eda100", "#1baf7a"], { light: true }),
    ],
  },
  {
    id: "r7",
    name: "인도향신료 커리하우스",
    category: "커리",
    lat: 37.4995,
    lng: 127.0255,
    address: "강남대로 350",
    walkMinutes: 6,
    deliveryMinutes: 28,
    deliveryAvailable: true,
    maxPartySize: 12,
    tags: ["매운거", "닭고기", "밥류"],
    menus: [
      menu("r7-1", "치킨커리", 12000, ["매운거", "닭고기", "밥류"], "🍛", ["#eb6834", "#eda100"], { spicy: true }),
      menu("r7-2", "버터치킨커리", 13000, ["닭고기", "밥류"], "🍛", ["#eda100", "#e87ba4"], {}),
    ],
  },
  {
    id: "r8",
    name: "포베트남쌀국수",
    category: "베트남음식",
    lat: 37.4975,
    lng: 127.0245,
    address: "역삼로 4길 9",
    walkMinutes: 9,
    deliveryMinutes: 32,
    deliveryAvailable: true,
    maxPartySize: 16,
    tags: ["국물", "면요리", "가벼운거"],
    menus: [
      menu("r8-1", "소고기쌀국수", 10000, ["국물", "면요리", "소고기", "고수"], "🍜", ["#1baf7a", "#199e70"], { soupy: true, light: true }),
      menu("r8-2", "분짜", 11000, ["면요리", "가벼운거", "고수", "오이"], "🥗", ["#1baf7a", "#eda100"], { light: true }),
    ],
  },
  {
    id: "r9",
    name: "BBQ 강남점",
    category: "치킨",
    lat: 37.4999,
    lng: 127.0282,
    address: "강남대로 330",
    walkMinutes: 5,
    deliveryMinutes: 30,
    deliveryAvailable: true,
    maxPartySize: 20,
    tags: ["치킨", "닭고기", "튀김"],
    menus: [
      menu("r9-1", "후라이드치킨", 20000, ["치킨", "닭고기", "튀김"], "🍗", ["#eda100", "#eb6834"], {}),
      menu("r9-2", "양념치킨", 21000, ["치킨", "닭고기", "매운거", "튀김"], "🍗", ["#e34948", "#eb6834"], { spicy: true }),
    ],
  },
  {
    id: "r10",
    name: "죽이야기 강남",
    category: "죽",
    lat: 37.4982,
    lng: 127.0299,
    address: "테헤란로 2길 4",
    walkMinutes: 4,
    deliveryMinutes: 22,
    deliveryAvailable: true,
    maxPartySize: 10,
    tags: ["가벼운거", "속편한거", "밥류"],
    menus: [
      menu("r10-1", "전복죽", 12000, ["가벼운거", "해산물"], "🥣", ["#1baf7a", "#2a78d6"], { light: true }),
      menu("r10-2", "야채죽", 9000, ["가벼운거", "채소"], "🥣", ["#1baf7a", "#199e70"], { light: true }),
    ],
  },
  {
    id: "r11",
    name: "샐러드박스",
    category: "샐러드",
    lat: 37.4971,
    lng: 127.0271,
    address: "강남대로 40길 7",
    walkMinutes: 6,
    deliveryMinutes: 25,
    deliveryAvailable: true,
    maxPartySize: 8,
    tags: ["가벼운거", "채소", "닭고기"],
    menus: [
      menu("r11-1", "닭가슴살샐러드", 9500, ["가벼운거", "채소", "닭고기", "오이"], "🥗", ["#1baf7a", "#008300"], { light: true }),
    ],
  },
  // 아래 두 곳은 '야근엔 고기 구이 & 술 없다' 원칙에 따라 추천 알고리즘이 항상 제외합니다.
  {
    id: "r12",
    name: "강남숯불갈비",
    category: "고기구이",
    lat: 37.4990,
    lng: 127.0310,
    address: "테헤란로 12길 3",
    walkMinutes: 7,
    deliveryMinutes: 0,
    deliveryAvailable: false,
    maxPartySize: 30,
    tags: ["고기", "구이"],
    menus: [
      menu("r12-1", "삼겹살", 16000, ["고기", "구이"], "🥓", ["#e34948", "#eb6834"], { isGrilled: true }),
      menu("r12-2", "소주", 4000, ["술"], "🍶", ["#2a78d6", "#3987e5"], { isAlcohol: true }),
    ],
  },
  {
    id: "r13",
    name: "호프타운",
    category: "호프/술집",
    lat: 37.4960,
    lng: 127.0280,
    address: "강남대로 20길 15",
    walkMinutes: 8,
    deliveryMinutes: 0,
    deliveryAvailable: false,
    maxPartySize: 25,
    tags: ["술", "안주"],
    menus: [
      menu("r13-1", "골뱅이무침", 18000, ["안주", "매운거"], "🦑", ["#e34948", "#e87ba4"], { isAlcohol: true }),
      menu("r13-2", "생맥주", 5000, ["술"], "🍺", ["#eda100", "#c98500"], { isAlcohol: true }),
    ],
  },
];

export const SEED_SPECIAL_DAYS: SpecialDay[] = [
  { date: "02-14", label: "발렌타인데이", boostTags: ["달달한거", "느끼한거"], emoji: "🍫" },
  { date: "03-14", label: "화이트데이", boostTags: ["달달한거"], emoji: "🍬" },
  { date: "07-08", label: "2026 월드컵 한국 경기 있는 날 (예시)", boostTags: ["치킨", "튀김", "매운거"], emoji: "⚽" },
  { date: "07-15", label: "초복 (예시)", boostTags: ["보양식", "닭고기"], emoji: "🐔" },
  { date: "10-31", label: "할로윈", boostTags: ["매운거"], emoji: "🎃" },
  { date: "12-25", label: "크리스마스", boostTags: ["면요리", "느끼한거"], emoji: "🎄" },
];

const LUNCH_MENU_POOL = [
  "제육볶음",
  "김치찌개",
  "돈까스",
  "비빔밥",
  "짜장면",
  "회덮밥",
  "된장찌개",
  "치킨마요덮밥",
  "샌드위치",
  "냉면",
];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export function generateSeedLunchRecords(): LunchRecord[] {
  const rand = seededRandom(42);
  const today = todayStr();
  const records: LunchRecord[] = [];
  // 오늘 점심은 팀원 절반 정도만 기록되어 있도록 (예시 데이터라 일부만)
  SEED_MEMBERS.forEach((mem, idx) => {
    if (idx % 2 === 0) {
      const pick = LUNCH_MENU_POOL[Math.floor(rand() * LUNCH_MENU_POOL.length)];
      records.push({ id: `lunch-${mem.id}-${today}`, date: today, memberId: mem.id, menu: pick });
    }
  });
  return records;
}

const LOG_RESTAURANT_WEIGHTS = ["r1", "r1", "r2", "r3", "r5", "r8", "r9", "r9", "r10", "r4", "r7"];

export function generateSeedDinnerLogs(): DinnerLog[] {
  const rand = seededRandom(7);
  const logs: DinnerLog[] = [];
  const today = new Date();
  const thisMonday = startOfWeek(today);
  // 지난 8주간 야근 식사 기록 예시 데이터 생성 (평일 기준 주 2~3회 정도)
  for (let w = 8; w >= 0; w--) {
    const weekMonday = addDays(thisMonday, -w * 7);
    const occurrences = 2 + Math.floor(rand() * 2); // 2~3회/주
    const usedDays = new Set<number>();
    let attempts = 0;
    while (usedDays.size < occurrences && attempts < 10) {
      const dayOffset = Math.floor(rand() * 5); // 평일 중 하루 (월~금)
      usedDays.add(dayOffset);
      attempts++;
    }
    usedDays.forEach((dayOffset) => {
      const date = addDays(weekMonday, dayOffset);
      const dateStr = toDateStr(date);
      if (dateStr > todayStr()) return;
      const restId = LOG_RESTAURANT_WEIGHTS[Math.floor(rand() * LOG_RESTAURANT_WEIGHTS.length)];
      const restaurant = SEED_RESTAURANTS.find((r) => r.id === restId)!;
      const menuItem = restaurant.menus[Math.floor(rand() * restaurant.menus.length)];
      const headcount = 2 + Math.floor(rand() * 4);
      const shuffled = [...SEED_MEMBERS].sort(() => rand() - 0.5);
      const attendees = shuffled.slice(0, Math.min(headcount, SEED_MEMBERS.length));
      logs.push({
        id: `log-${dateStr}-${restId}-${Math.floor(rand() * 10000)}`,
        date: dateStr,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        menuName: menuItem.name,
        headcount,
        memberIds: attendees.map((m) => m.id),
        mode: restaurant.deliveryAvailable && rand() > 0.5 ? "delivery" : "dine-in",
      });
    });
  }
  return logs.sort((a, b) => (a.date < b.date ? 1 : -1));
}
