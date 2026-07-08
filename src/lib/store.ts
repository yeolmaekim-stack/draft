"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DinnerLog, LunchRecord, TeamMember, TonightState } from "@/types";
import {
  SEED_MEMBERS,
  generateSeedDinnerLogs,
  generateSeedLunchRecords,
} from "@/lib/seedData";
import { todayStr } from "@/lib/dates";

interface StoreState {
  members: TeamMember[];
  lunchRecords: LunchRecord[];
  dinnerLogs: DinnerLog[];
  tonight: TonightState;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  addMember: (m: Omit<TeamMember, "id">) => void;
  updateMember: (id: string, patch: Partial<TeamMember>) => void;
  removeMember: (id: string) => void;

  setLunch: (memberId: string, menuText: string) => void;
  removeLunch: (recordId: string) => void;

  toggleAttendee: (memberId: string) => void;
  setAllAttendees: (ids: string[]) => void;
  setMode: (mode: "dine-in" | "delivery") => void;

  addDinnerLog: (log: Omit<DinnerLog, "id">) => void;
  removeDinnerLog: (id: string) => void;
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      members: SEED_MEMBERS,
      lunchRecords: generateSeedLunchRecords(),
      dinnerLogs: generateSeedDinnerLogs(),
      tonight: {
        date: todayStr(),
        attendeeIds: SEED_MEMBERS.map((m) => m.id),
        mode: "dine-in",
      },
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      addMember: (m) =>
        set((s) => ({ members: [...s.members, { ...m, id: uid("m") }] })),
      updateMember: (id, patch) =>
        set((s) => ({
          members: s.members.map((mem) => (mem.id === id ? { ...mem, ...patch } : mem)),
        })),
      removeMember: (id) =>
        set((s) => ({
          members: s.members.filter((mem) => mem.id !== id),
          tonight: {
            ...s.tonight,
            attendeeIds: s.tonight.attendeeIds.filter((aid) => aid !== id),
          },
        })),

      setLunch: (memberId, menuText) =>
        set((s) => {
          const today = todayStr();
          const existing = s.lunchRecords.find(
            (r) => r.memberId === memberId && r.date === today
          );
          if (existing) {
            return {
              lunchRecords: s.lunchRecords.map((r) =>
                r.id === existing.id ? { ...r, menu: menuText } : r
              ),
            };
          }
          return {
            lunchRecords: [
              ...s.lunchRecords,
              { id: uid("lunch"), date: today, memberId, menu: menuText },
            ],
          };
        }),
      removeLunch: (recordId) =>
        set((s) => ({ lunchRecords: s.lunchRecords.filter((r) => r.id !== recordId) })),

      toggleAttendee: (memberId) =>
        set((s) => {
          const has = s.tonight.attendeeIds.includes(memberId);
          return {
            tonight: {
              ...s.tonight,
              attendeeIds: has
                ? s.tonight.attendeeIds.filter((id) => id !== memberId)
                : [...s.tonight.attendeeIds, memberId],
            },
          };
        }),
      setAllAttendees: (ids) => set((s) => ({ tonight: { ...s.tonight, attendeeIds: ids } })),
      setMode: (mode) => set((s) => ({ tonight: { ...s.tonight, mode } })),

      addDinnerLog: (log) =>
        set((s) => ({ dinnerLogs: [{ ...log, id: uid("log") }, ...s.dinnerLogs] })),
      removeDinnerLog: (id) =>
        set((s) => ({ dinnerLogs: s.dinnerLogs.filter((l) => l.id !== id) })),
    }),
    {
      name: "yagun-menu-store-v1",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const today = todayStr();
          if (state.tonight.date !== today) {
            state.tonight = {
              date: today,
              attendeeIds: state.members.map((m) => m.id),
              mode: "dine-in",
            };
          }
          state.setHasHydrated(true);
        }
      },
    }
  )
);
