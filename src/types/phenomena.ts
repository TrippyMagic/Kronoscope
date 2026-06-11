/**
 * src/types/phenomena.ts
 * Type definitions for Timescales phenomena data.
 */

export type PhenomenonCategory =
  | "quantum"
  | "biological"
  | "human"
  | "geological"
  | "cosmic";

export const PHENOMENON_CATEGORIES = [
  "quantum",
  "biological",
  "human",
  "geological",
  "cosmic",
] as const satisfies PhenomenonCategory[];

export const PHENOMENON_CATEGORY_META: Record<
  PhenomenonCategory,
  { label: string; color: string }
> = {
  quantum:    { label: "Quantum",    color: "#f472b6" }, // pink
  biological: { label: "Biological", color: "#34d399" }, // emerald
  human:      { label: "Human",      color: "#38bdf8" }, // sky blue
  geological: { label: "Geological", color: "#fb923c" }, // orange
  cosmic:     { label: "Cosmic",     color: "#a78bfa" }, // violet
};

/** The full log10 range of ALL timescales (Planck → black hole evaporation). */
export const PHENOMENA_LOG_MIN = -44; // Planck time ≈ 10^-44 s
export const PHENOMENA_LOG_MAX =  75; // Black hole evaporation ≈ 10^74 s

export type TimescalePhenomenon = {
  id: string;
  label: string;
  /** Duration in seconds */
  durationSeconds: number;
  category: PhenomenonCategory;
  description?: string;
  /** Short examples shown in tooltips/cards */
  examples?: string[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isPhenomenonCategory = (value: unknown): value is PhenomenonCategory =>
  typeof value === "string" && PHENOMENON_CATEGORIES.includes(value as PhenomenonCategory);

const normalizeExamples = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const examples = value.filter(isNonEmptyString);
  return examples.length > 0 ? examples : undefined;
};

export const parseTimescalePhenomena = (raw: unknown): TimescalePhenomenon[] =>
  Array.isArray(raw)
    ? raw.flatMap(item => {
        if (!isRecord(item)) return [];
        if (!isNonEmptyString(item.id) || !isNonEmptyString(item.label)) return [];
        if (!isPhenomenonCategory(item.category)) return [];
        if (typeof item.durationSeconds !== "number" || !Number.isFinite(item.durationSeconds) || item.durationSeconds <= 0) {
          return [];
        }

        return [{
          id: item.id,
          label: item.label,
          durationSeconds: item.durationSeconds,
          category: item.category,
          description: isNonEmptyString(item.description) ? item.description : undefined,
          examples: normalizeExamples(item.examples),
        }];
      })
    : [];

