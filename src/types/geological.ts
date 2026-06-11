/**
 * src/types/geological.ts
 * Type definitions for the Geological & Cosmic Explorer (Phase 4).
 */

export type GeologicalRank = "eon" | "era" | "period" | "epoch";

export const GEOLOGICAL_RANKS = [
  "eon",
  "era",
  "period",
  "epoch",
] as const satisfies GeologicalRank[];

export type GeologicalUnit = {
  id: string;
  name: string;
  rank: GeologicalRank;
  /** Millions of years ago — start of the unit (larger = older). */
  startMya: number;
  /** Millions of years ago — end of the unit (0 = present). */
  endMya: number;
  /** ICS standard colour (hex). */
  color: string;
  description?: string;
  keyEvents?: string[];
  /** Sub-units one rank below (eon → era → period → epoch). */
  children?: GeologicalUnit[];
};

export type CosmicMilestone = {
  id: string;
  name: string;
  /** Millions of years ago (0 = present). */
  timeAgoMya: number;
  description?: string;
  /** Emoji icon shown on the timeline. */
  icon?: string;
};

export type GeoExplorerData = {
  geological: GeologicalUnit[];
  cosmic: CosmicMilestone[];
};

/** Labels for each geological rank (display use). */
export const RANK_LABELS: Record<GeologicalRank, string> = {
  eon:    "Eon",
  era:    "Era",
  period: "Period",
  epoch:  "Epoch",
};

/** Abbreviations for rank badges. */
export const RANK_ABBR: Record<GeologicalRank, string> = {
  eon:    "EON",
  era:    "ERA",
  period: "PERIOD",
  epoch:  "EPOCH",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isGeologicalRank = (value: unknown): value is GeologicalRank =>
  typeof value === "string" && GEOLOGICAL_RANKS.includes(value as GeologicalRank);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const normalizeStrings = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const values = value.filter(isNonEmptyString);
  return values.length > 0 ? values : undefined;
};

const parseGeologicalUnit = (value: unknown): GeologicalUnit | null => {
  if (!isRecord(value)) return null;
  if (!isNonEmptyString(value.id) || !isNonEmptyString(value.name)) return null;
  if (!isGeologicalRank(value.rank)) return null;
  if (!isFiniteNumber(value.startMya) || !isFiniteNumber(value.endMya)) return null;
  if (!isNonEmptyString(value.color)) return null;

  const children = Array.isArray(value.children)
    ? value.children.flatMap(child => {
        const parsed = parseGeologicalUnit(child);
        return parsed ? [parsed] : [];
      })
    : undefined;

  return {
    id: value.id,
    name: value.name,
    rank: value.rank,
    startMya: value.startMya,
    endMya: value.endMya,
    color: value.color,
    description: isNonEmptyString(value.description) ? value.description : undefined,
    keyEvents: normalizeStrings(value.keyEvents),
    children: children && children.length > 0 ? children : undefined,
  };
};

const parseCosmicMilestone = (value: unknown): CosmicMilestone | null => {
  if (!isRecord(value)) return null;
  if (!isNonEmptyString(value.id) || !isNonEmptyString(value.name)) return null;
  if (!isFiniteNumber(value.timeAgoMya)) return null;

  return {
    id: value.id,
    name: value.name,
    timeAgoMya: value.timeAgoMya,
    description: isNonEmptyString(value.description) ? value.description : undefined,
    icon: isNonEmptyString(value.icon) ? value.icon : undefined,
  };
};

export const parseGeoExplorerData = (raw: unknown): GeoExplorerData | null => {
  if (!isRecord(raw)) return null;
  const geological = Array.isArray(raw.geological)
    ? raw.geological.flatMap(item => {
        const parsed = parseGeologicalUnit(item);
        return parsed ? [parsed] : [];
      })
    : [];
  const cosmic = Array.isArray(raw.cosmic)
    ? raw.cosmic.flatMap(item => {
        const parsed = parseCosmicMilestone(item);
        return parsed ? [parsed] : [];
      })
    : [];

  return { geological, cosmic };
};

