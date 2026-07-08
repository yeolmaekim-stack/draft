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

// 강남역 인근 실제 상호를 참고해 구성했습니다. 메뉴 구성/가격은 예시이며 실제와 다를 수 있어요.
export const SEED_RESTAURANTS: Restaurant[] = [
  {
    id: "r1",
    name: "국밥생각 강남역점",
    category: "국밥",
    lat: 37.4989,
    lng: 127.0271,
    address: "테헤란로4길 13 (강남역 1번 출구 도보 3분)",
    walkMinutes: 3,
    deliveryMinutes: 20,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 20,
    tags: ["국물", "돼지고기", "따뜻한거", "밥류"],
    menus: [
      menu("r1-1", "기본국밥", 10000, ["국물", "돼지고기", "따뜻한거"], "🍲", ["#eda100", "#c98500"], { soupy: true }),
      menu("r1-2", "얼큰국밥", 10000, ["국물", "돼지고기", "매운거", "따뜻한거"], "🍜", ["#eb6834", "#d95926"], { soupy: true, spicy: true }),
      menu("r1-3", "삼계탕", 16000, ["보양식", "닭고기", "따뜻한거"], "🍗", ["#eda100", "#eb6834"], { soupy: true }),
    ],
  },
  {
    id: "r2",
    name: "강남 진해장",
    category: "해장국",
    lat: 37.4967,
    lng: 127.0292,
    address: "테헤란로 4길 부근",
    walkMinutes: 6,
    deliveryMinutes: 25,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 16,
    tags: ["국물", "돼지고기", "따뜻한거"],
    menus: [
      menu("r2-1", "뼈해장국", 11000, ["국물", "돼지고기", "따뜻한거"], "🍲", ["#eb6834", "#d95926"], { soupy: true }),
      menu("r2-2", "우거지해장국", 10000, ["국물", "채소", "따뜻한거"], "🍜", ["#008300", "#199e70"], { soupy: true, light: true }),
    ],
  },
  {
    id: "r3",
    name: "정상마라 강남본점",
    category: "마라탕",
    lat: 37.4972,
    lng: 127.0298,
    address: "강남역 인근 (24시간 영업)",
    walkMinutes: 5,
    deliveryMinutes: 25,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 14,
    tags: ["매운거", "마라", "면요리", "국물"],
    menus: [
      menu("r3-1", "마라탕(중)", 13000, ["매운거", "마라", "국물"], "🌶️", ["#e34948", "#e66767"], { spicy: true, soupy: true }),
      menu("r3-2", "마라샹궈", 16000, ["매운거", "마라", "고기"], "🔥", ["#e34948", "#eb6834"], { spicy: true }),
    ],
  },
  {
    id: "r4",
    name: "중경마라탕",
    category: "마라탕",
    lat: 37.4960,
    lng: 127.0289,
    address: "강남대로 인근",
    walkMinutes: 7,
    deliveryMinutes: 28,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 10,
    tags: ["매운거", "마라", "국물", "튀김"],
    menus: [
      menu("r4-1", "마라탕(대)", 15000, ["매운거", "마라", "국물"], "🌶️", ["#e34948", "#d95926"], { spicy: true, soupy: true }),
      menu("r4-2", "꿔바로우", 14000, ["튀김", "달달한거"], "🍖", ["#eda100", "#e87ba4"], {}),
    ],
  },
  {
    id: "r5",
    name: "멘노아지 라멘바",
    category: "라멘",
    lat: 37.4964,
    lng: 127.0301,
    address: "강남역 12번 출구 도보 5분",
    walkMinutes: 5,
    deliveryMinutes: 25,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 12,
    tags: ["면요리", "국물", "돼지고기", "따뜻한거"],
    menus: [
      menu("r5-1", "돈코츠라멘", 11500, ["면요리", "국물", "돼지고기", "따뜻한거"], "🍜", ["#eda100", "#c98500"], { soupy: true }),
      menu("r5-2", "츠케멘", 12000, ["면요리", "국물"], "🍥", ["#eda100", "#eb6834"], { soupy: true }),
    ],
  },
  {
    id: "r6",
    name: "오레노라멘",
    category: "라멘",
    lat: 37.4993,
    lng: 127.0293,
    address: "강남대로 인근",
    walkMinutes: 8,
    deliveryMinutes: 30,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 14,
    tags: ["면요리", "국물", "가벼운거", "따뜻한거"],
    menus: [
      menu("r6-1", "시오라멘", 10000, ["면요리", "국물", "가벼운거"], "🍜", ["#1baf7a", "#199e70"], { soupy: true, light: true }),
      menu("r6-2", "미소라멘", 10500, ["면요리", "국물", "따뜻한거"], "🍥", ["#eda100", "#c98500"], { soupy: true }),
    ],
  },
  {
    id: "r7",
    name: "땀땀 강남본점",
    category: "베트남쌀국수",
    lat: 37.4977,
    lng: 127.0250,
    address: "강남역 인근",
    walkMinutes: 4,
    deliveryMinutes: 22,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 16,
    tags: ["국물", "면요리", "소고기", "매운거"],
    menus: [
      menu("r7-1", "매운 소곱창쌀국수", 13000, ["국물", "면요리", "소고기", "매운거", "고수"], "🍜", ["#e34948", "#199e70"], { soupy: true, spicy: true }),
      menu("r7-2", "하노이비프쌀국수", 12000, ["국물", "면요리", "소고기", "고수"], "🍜", ["#1baf7a", "#199e70"], { soupy: true, light: true }),
    ],
  },
  {
    id: "r8",
    name: "에머이 강남역점",
    category: "베트남음식",
    lat: 37.4970,
    lng: 127.0243,
    address: "역삼로 인근",
    walkMinutes: 9,
    deliveryMinutes: 32,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 16,
    tags: ["면요리", "채소", "튀김"],
    menus: [
      menu("r8-1", "분짜", 12000, ["면요리", "가벼운거", "고수", "오이"], "🥗", ["#1baf7a", "#eda100"], { light: true }),
      menu("r8-2", "반쎄오", 14000, ["튀김", "채소"], "🥘", ["#eda100", "#eb6834"], {}),
    ],
  },
  {
    id: "r9",
    name: "꼬끼오 장작구이",
    category: "치킨",
    lat: 37.4998,
    lng: 127.0280,
    address: "강남대로 인근",
    walkMinutes: 6,
    deliveryMinutes: 28,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 18,
    tags: ["치킨", "닭고기"],
    menus: [
      menu("r9-1", "장작구이 통닭", 22000, ["치킨", "닭고기"], "🍗", ["#eda100", "#eb6834"], {}),
      menu("r9-2", "반반치킨", 23000, ["치킨", "닭고기", "매운거"], "🍗", ["#e34948", "#eb6834"], { spicy: true }),
    ],
  },
  {
    id: "r10",
    name: "돈치킨",
    category: "치킨",
    lat: 37.4985,
    lng: 127.0263,
    address: "강남대로 302 인근",
    walkMinutes: 4,
    deliveryMinutes: 20,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 20,
    tags: ["치킨", "닭고기", "튀김"],
    menus: [
      menu("r10-1", "후라이드치킨", 19000, ["치킨", "닭고기", "튀김"], "🍗", ["#eda100", "#c98500"], {}),
      menu("r10-2", "양념치킨", 20000, ["치킨", "닭고기", "매운거", "튀김"], "🍗", ["#e34948", "#eb6834"], { spicy: true }),
    ],
  },
  {
    id: "r11",
    name: "예쁜할머니네",
    category: "분식",
    lat: 37.4986,
    lng: 127.0259,
    address: "강남역 인근 (포장 위주)",
    walkMinutes: 3,
    deliveryMinutes: 0,
    deliveryAvailable: false,
    dineInAvailable: true,
    maxPartySize: 10,
    tags: ["분식", "매운거", "밥류"],
    menus: [
      menu("r11-1", "떡볶이", 4000, ["매운거", "분식"], "🍢", ["#e34948", "#e87ba4"], { spicy: true }),
      menu("r11-2", "김밥", 3500, ["밥류", "가벼운거"], "🍙", ["#1baf7a", "#199e70"], { light: true }),
      menu("r11-3", "순대", 5000, ["분식", "돼지고기"], "🍡", ["#eb6834", "#e87ba4"], {}),
    ],
  },
  {
    id: "r12",
    name: "스시마이우",
    category: "초밥",
    lat: 37.4966,
    lng: 127.0304,
    address: "강남역 인근 (배달 인기)",
    walkMinutes: 7,
    deliveryMinutes: 30,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 10,
    tags: ["해산물", "초밥", "가벼운거"],
    menus: [
      menu("r12-1", "모둠초밥", 19000, ["해산물", "초밥", "갑각류"], "🍣", ["#2a78d6", "#3987e5"], {}),
      menu("r12-2", "연어초밥세트", 17000, ["해산물", "초밥", "가벼운거"], "🐟", ["#2a78d6", "#1baf7a"], { light: true }),
    ],
  },
  {
    id: "r13",
    name: "파스타포포",
    category: "양식",
    lat: 37.4963,
    lng: 127.0267,
    address: "강남대로 인근",
    walkMinutes: 7,
    deliveryMinutes: 30,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 12,
    tags: ["면요리", "느끼한거"],
    menus: [
      menu("r13-1", "로제파스타", 14000, ["면요리", "느끼한거"], "🍝", ["#e87ba4", "#d55181"], {}),
      menu("r13-2", "알리오올리오", 12000, ["면요리", "가벼운거"], "🍝", ["#eda100", "#1baf7a"], { light: true }),
    ],
  },
  {
    id: "r14",
    name: "코코이찌방야 강남2호점",
    category: "일본식카레",
    lat: 37.4980,
    lng: 127.0262,
    address: "강남역 11번 출구 인근",
    walkMinutes: 4,
    deliveryMinutes: 24,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 12,
    tags: ["닭고기", "밥류", "튀김"],
    menus: [
      menu("r14-1", "치킨카츠카레", 13000, ["닭고기", "밥류", "튀김"], "🍛", ["#eb6834", "#eda100"], {}),
      menu("r14-2", "야채카레", 10000, ["채소", "밥류", "가벼운거"], "🍛", ["#eda100", "#008300"], { light: true }),
    ],
  },
  {
    id: "r15",
    name: "프로티너",
    category: "샐러드",
    lat: 37.4974,
    lng: 127.0271,
    address: "강남대로 인근",
    walkMinutes: 6,
    deliveryMinutes: 24,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 8,
    tags: ["가벼운거", "채소", "닭고기"],
    menus: [
      menu("r15-1", "닭가슴살 프로틴샐러드", 10500, ["가벼운거", "채소", "닭고기", "오이"], "🥗", ["#1baf7a", "#008300"], { light: true }),
    ],
  },
  {
    id: "r16",
    name: "본죽 강남역점",
    category: "죽",
    lat: 37.4983,
    lng: 127.0300,
    address: "테헤란로 인근",
    walkMinutes: 5,
    deliveryMinutes: 22,
    deliveryAvailable: true,
    dineInAvailable: true,
    maxPartySize: 10,
    tags: ["가벼운거", "속편한거", "밥류"],
    menus: [
      menu("r16-1", "전복죽", 13000, ["가벼운거", "해산물"], "🥣", ["#1baf7a", "#2a78d6"], { light: true }),
      menu("r16-2", "야채죽", 9000, ["가벼운거", "채소"], "🥣", ["#1baf7a", "#199e70"], { light: true }),
    ],
  },
  // 아래 두 곳은 '야근엔 고기 구이 & 술 없다' 원칙에 따라 추천 알고리즘이 항상 제외합니다.
  {
    id: "r17",
    name: "다몽집",
    category: "고기구이",
    lat: 37.4992,
    lng: 127.0308,
    address: "강남대로100길 13",
    walkMinutes: 8,
    deliveryMinutes: 0,
    deliveryAvailable: false,
    dineInAvailable: true,
    maxPartySize: 24,
    tags: ["고기", "구이"],
    menus: [
      menu("r17-1", "삼겹살", 17000, ["고기", "구이"], "🥓", ["#e34948", "#eb6834"], { isGrilled: true }),
      menu("r17-2", "소주", 4000, ["술"], "🍶", ["#2a78d6", "#3987e5"], { isAlcohol: true }),
    ],
  },
  {
    id: "r18",
    name: "나즈드라비",
    category: "호프/맥주",
    lat: 37.4958,
    lng: 127.0277,
    address: "강남역 인근",
    walkMinutes: 9,
    deliveryMinutes: 0,
    deliveryAvailable: false,
    dineInAvailable: true,
    maxPartySize: 20,
    tags: ["술", "안주"],
    menus: [
      menu("r18-1", "굴라쉬", 16000, ["안주"], "🍲", ["#e34948", "#e87ba4"], { isAlcohol: true }),
      menu("r18-2", "체코생맥주", 6000, ["술"], "🍺", ["#eda100", "#c98500"], { isAlcohol: true }),
    ],
  },
];

export const SEED_SPECIAL_DAYS: SpecialDay[] = [
  { date: "02-14", label: "발렌타인데이", boostTags: ["달달한거", "느끼한거"], emoji: "🍫" },
  { date: "03-14", label: "화이트데이", boostTags: ["달달한거"], emoji: "🍬" },
  { date: "07-08", label: "복날 - 보양해야돼요", boostTags: ["보양식", "닭고기", "따뜻한거"], emoji: "🐔" },
  { date: "07-15", label: "초복 - 보양해야돼요", boostTags: ["보양식", "닭고기"], emoji: "🐔" },
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

const LOG_RESTAURANT_WEIGHTS = ["r1", "r1", "r3", "r5", "r7", "r9", "r10", "r10", "r12", "r14", "r16"];

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
