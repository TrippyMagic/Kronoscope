import { createContext, useContext, useState, ReactNode } from "react";
import {
  readStorageString,
  removeStorageItem,
  writeStorageString,
} from "../utils/storage";

type Ctx = {
  birthDate: Date | null;
  setBirthDate: (d: Date) => void;
  birthTime: string;                
  setBirthTime: (t: string) => void;
  clearBirthDate: () => void;
};

const BirthCtx = createContext<Ctx | undefined>(undefined);

const MIN_BIRTH_YEAR = 1900;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const isValidBirthDate = (date: Date): boolean => {
  if (!Number.isFinite(date.getTime())) return false;
  const year = date.getFullYear();
  if (year < MIN_BIRTH_YEAR || year > new Date().getFullYear()) return false;
  return date <= new Date();
};

const readBirthDate = (): Date | null => {
  const raw = readStorageString("dob");
  if (!raw) return null;
  const date = new Date(raw);
  return isValidBirthDate(date) ? date : null;
};

const normalizeBirthTime = (value: string | null): string =>
  value && TIME_RE.test(value) ? value : "00:00";

export function BirthDateProvider({ children }: { children: ReactNode }) {
  /* ---------- date (persisted) -------------------- */
  const [birthDate, setBirthDateState] = useState<Date | null>(readBirthDate);

  const setBirthDate = (d: Date) => {
    if (!isValidBirthDate(d)) return;
    setBirthDateState(d);
    writeStorageString("dob", d.toISOString());
  };

  /* ---------- time (persisted) -------------------- */
  const [birthTime, setBirthTimeState] = useState<string>(() => {
    return normalizeBirthTime(readStorageString("dobTime"));
  });

  const setBirthTime = (t: string) => {
    const safeTime = normalizeBirthTime(t);
    setBirthTimeState(safeTime);
    writeStorageString("dobTime", safeTime);
  };

  const clearBirthDate = () => {
    setBirthDateState(null);
    setBirthTimeState("00:00");
    removeStorageItem("dob");
    removeStorageItem("dobTime");
  };

  /* ---------- context value ----------------------- */
  return (
    <BirthCtx.Provider
      value={{ birthDate, setBirthDate, birthTime, setBirthTime, clearBirthDate }}
    >
      {children}
    </BirthCtx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBirthDate() {
  const ctx = useContext(BirthCtx);
  if (!ctx)
    throw new Error("useBirthDate must be used inside BirthDateProvider");
  return ctx;
}
