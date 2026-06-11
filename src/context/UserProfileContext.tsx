/**
 * src/context/UserProfileContext.tsx
 * Optional user profile that refines estimate ranges.
 * Persisted in localStorage.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { readStorageJson, writeStorageJson } from "../utils/storage";

export type ActivityLevel = "sedentary" | "moderate" | "active";

export type UserProfile = {
  // Physical (optional)
  restingHeartRate?: number;   // bpm
  height?: number;             // cm
  weight?: number;             // kg

  // Lifestyle (optional)
  activityLevel?: ActivityLevel;
  sleepHoursPerDay?: number;
  screenHoursPerDay?: number;
};

const LS_KEY = "user_profile";

const EMPTY: UserProfile = {};

const isActivityLevel = (value: unknown): value is ActivityLevel =>
  value === "sedentary" || value === "moderate" || value === "active";

const finiteInRange = (value: unknown, min: number, max: number): number | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= min && value <= max
    ? value
    : undefined;

const normalizeProfile = (value: unknown): UserProfile => {
  if (typeof value !== "object" || value === null) return EMPTY;
  const source = value as Record<string, unknown>;
  const profile: UserProfile = {};

  const restingHeartRate = finiteInRange(source.restingHeartRate, 30, 200);
  const height = finiteInRange(source.height, 50, 250);
  const weight = finiteInRange(source.weight, 20, 300);
  const sleepHoursPerDay = finiteInRange(source.sleepHoursPerDay, 2, 18);
  const screenHoursPerDay = finiteInRange(source.screenHoursPerDay, 0, 24);

  if (restingHeartRate !== undefined) profile.restingHeartRate = restingHeartRate;
  if (height !== undefined) profile.height = height;
  if (weight !== undefined) profile.weight = weight;
  if (isActivityLevel(source.activityLevel)) profile.activityLevel = source.activityLevel;
  if (sleepHoursPerDay !== undefined) profile.sleepHoursPerDay = sleepHoursPerDay;
  if (screenHoursPerDay !== undefined) profile.screenHoursPerDay = screenHoursPerDay;

  return profile;
};

const readProfile = (): UserProfile => {
  return normalizeProfile(readStorageJson<unknown>(LS_KEY, EMPTY));
};

const writeProfile = (p: UserProfile) => {
  writeStorageJson(LS_KEY, normalizeProfile(p));
};

type ProfileCtx = {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  resetProfile: () => void;
};

const Ctx = createContext<ProfileCtx | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(readProfile);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile(prev => {
      // Strip undefined values from patch so they don't pollute storage
      const cleaned = { ...prev };
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === null || (typeof v === "number" && isNaN(v))) {
          delete (cleaned as Record<string, unknown>)[k];
        } else {
          (cleaned as Record<string, unknown>)[k] = v;
        }
      }
      const normalized = normalizeProfile(cleaned);
      writeProfile(normalized);
      return normalized;
    });
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(EMPTY);
    writeProfile(EMPTY);
  }, []);

  return (
    <Ctx.Provider value={{ profile, updateProfile, resetProfile }}>
      {children}
    </Ctx.Provider>
  );
}

export function useUserProfile(): ProfileCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUserProfile must be used inside UserProfileProvider");
  return ctx;
}


