"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  LabelList,
} from "recharts";
import { useStore } from "@/lib/store";
import Hydrated from "@/components/Hydrated";
import {
  weeklyStats,
  monthlyStats,
  topBy,
  weeklyTrend,
  dayOfWeekDistribution,
  modeSplit,
} from "@/lib/analytics";

const SERIES = ["#3987e5", "#199e70", "#c98500", "#008300", "#9085e9"];
const CHART_TEXT = { fill: "#c3c2b7", fontSize: 12 };

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card-solid p-5">
      <p className="text-[12px] text-white/50">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-white/35">{sub}</p>}
    </div>
  );
}

function AnalyticsContent() {
  const dinnerLogs = useStore((s) => s.dinnerLogs);

  const week = useMemo(() => weeklyStats(dinnerLogs), [dinnerLogs]);
  const month = useMemo(() => monthlyStats(dinnerLogs), [dinnerLogs]);
  const topRestaurants = useMemo(() => topBy(dinnerLogs, "restaurantName", 5), [dinnerLogs]);
  const topMenus = useMemo(() => topBy(dinnerLogs, "menuName", 5), [dinnerLogs]);
  const trend = useMemo(() => weeklyTrend(dinnerLogs, 8), [dinnerLogs]);
  const dow = useMemo(() => dayOfWeekDistribution(dinnerLogs), [dinnerLogs]);
  const mode = useMemo(() => modeSplit(dinnerLogs), [dinnerLogs]);
  const modeTotal = mode.dineIn + mode.delivery || 1;

  const bestRestaurant = topRestaurants[0]?.name ?? "-";
  const bestMenu = topMenus[0]?.name ?? "-";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">우리팀 야근 메뉴 분석표 📊</h1>
        <p className="mt-1 text-sm text-white/55">
          추천 결과와 상관없이 실제로 기록한 야근 식사 데이터를 분석해요. 이 통계는 다시 오늘의 추천 알고리즘에도
          반영돼요 (📈 단골 메뉴 가산점 · 🔁 최근 방문 페널티).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="이번주 평균 야근 식사 인원" value={`${week.avgHeadcount || 0}명`} sub={`${week.count}건 기록`} />
        <StatTile label="이번달 평균 야근 식사 인원" value={`${month.avgHeadcount || 0}명`} sub={`${month.count}건 기록`} />
        <StatTile label="가장 많이 간 식당" value={bestRestaurant} sub={topRestaurants[0] ? `${topRestaurants[0].count}회 방문` : ""} />
        <StatTile label="가장 많이 먹은 메뉴" value={bestMenu} sub={topMenus[0] ? `${topMenus[0].count}회 선택` : ""} />
      </div>

      <div className="card-solid p-5">
        <p className="mb-3 text-sm font-semibold text-white/80">주간 평균 야근 식사 인원 추이 (최근 8주)</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trend} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#2c2c2a" vertical={false} />
            <XAxis dataKey="label" tick={CHART_TEXT} axisLine={{ stroke: "#383835" }} tickLine={false} />
            <YAxis tick={CHART_TEXT} axisLine={{ stroke: "#383835" }} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{ background: "#232320", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}
              labelStyle={{ color: "#fff" }}
              formatter={(value) => [`${value}명`, "평균 인원"]}
            />
            <Line
              type="monotone"
              dataKey="avgHeadcount"
              stroke={SERIES[0]}
              strokeWidth={2}
              dot={{ r: 3, fill: SERIES[0] }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-solid p-5">
          <p className="mb-3 text-sm font-semibold text-white/80">가장 많이 간 식당 TOP 5</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topRestaurants} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid stroke="#2c2c2a" horizontal={false} />
              <XAxis type="number" tick={CHART_TEXT} axisLine={{ stroke: "#383835" }} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={CHART_TEXT} width={90} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#232320", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => [`${value}회`, "방문"]}
              />
              <Bar dataKey="count" fill={SERIES[0]} radius={[0, 4, 4, 0]} barSize={16}>
                <LabelList dataKey="count" position="right" fill="#fff" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-solid p-5">
          <p className="mb-3 text-sm font-semibold text-white/80">가장 많이 먹은 메뉴 TOP 5</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topMenus} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid stroke="#2c2c2a" horizontal={false} />
              <XAxis type="number" tick={CHART_TEXT} axisLine={{ stroke: "#383835" }} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={CHART_TEXT} width={90} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#232320", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => [`${value}회`, "선택"]}
              />
              <Bar dataKey="count" fill={SERIES[1]} radius={[0, 4, 4, 0]} barSize={16}>
                <LabelList dataKey="count" position="right" fill="#fff" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-solid p-5">
          <p className="mb-3 text-sm font-semibold text-white/80">요일별 야근 식사 횟수</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dow} margin={{ left: -12 }}>
              <CartesianGrid stroke="#2c2c2a" vertical={false} />
              <XAxis dataKey="label" tick={CHART_TEXT} axisLine={{ stroke: "#383835" }} tickLine={false} />
              <YAxis tick={CHART_TEXT} axisLine={{ stroke: "#383835" }} tickLine={false} width={30} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#232320", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => [`${value}회`, "횟수"]}
              />
              <Bar dataKey="count" fill={SERIES[2]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-solid flex flex-col justify-center gap-4 p-5">
          <p className="text-sm font-semibold text-white/80">가서 먹기 vs 배달</p>
          <div>
            <div className="mb-1 flex justify-between text-[12px] text-white/60">
              <span>🚶 가서 먹기</span>
              <span>{mode.dineIn}건 ({Math.round((mode.dineIn / modeTotal) * 100)}%)</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${(mode.dineIn / modeTotal) * 100}%`, background: SERIES[0] }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[12px] text-white/60">
              <span>🛵 배달</span>
              <span>{mode.delivery}건 ({Math.round((mode.delivery / modeTotal) * 100)}%)</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${(mode.delivery / modeTotal) * 100}%`, background: SERIES[1] }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Hydrated>
      <AnalyticsContent />
    </Hydrated>
  );
}
