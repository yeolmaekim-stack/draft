export type TasteTag = string;

export interface TeamMember {
  id: string;
  name: string;
  emoji: string;
  color: string;
  likes: TasteTag[];
  dislikes: TasteTag[];
  cannotEat: TasteTag[];
}

export interface LunchRecord {
  id: string;
  date: string; // YYYY-MM-DD
  memberId: string;
  menu: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  tags: TasteTag[];
  isGrilled?: boolean;
  isAlcohol?: boolean;
  spicy?: boolean;
  soupy?: boolean;
  light?: boolean;
  emoji: string;
  gradient: [string, string];
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address: string;
  walkMinutes: number;
  deliveryMinutes: number;
  deliveryAvailable: boolean;
  dineInAvailable: boolean;
  maxPartySize: number;
  tags: TasteTag[];
  menus: MenuItem[];
}

export interface SpecialDay {
  date: string; // MM-DD
  label: string;
  boostTags: TasteTag[];
  emoji: string;
}

export interface DinnerLog {
  id: string;
  date: string; // YYYY-MM-DD
  restaurantId: string | null;
  restaurantName: string;
  menuName: string;
  headcount: number;
  memberIds: string[];
  mode: "dine-in" | "delivery";
  note?: string;
}

export interface TonightState {
  date: string;
  attendeeIds: string[];
  mode: "dine-in" | "delivery";
}

export type WeatherCondition =
  | "clear"
  | "cloudy"
  | "rain"
  | "snow"
  | "thunder"
  | "fog";

export interface WeatherInfo {
  condition: WeatherCondition;
  temperature: number;
  isDay: boolean;
  sunset: string | null; // ISO
  source: "live" | "fallback";
}

export interface RecommendationReason {
  emoji: string;
  text: string;
}

export interface RecommendationResult {
  restaurant: Restaurant;
  menu: MenuItem;
  score: number;
  reasons: RecommendationReason[];
}
