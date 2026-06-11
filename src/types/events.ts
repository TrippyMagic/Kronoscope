/**
 * src/types/events.ts
 * Shared types for historical/contextual timeline events
 */

/** Visual/thematic category for a timeline event */
export type EventCategory =
  | "historical"
  | "scientific"
  | "technological"
  | "space"
  | "cultural";

export type ProjectionType = "scheduled" | "astronomical" | "forecast" | "speculative";
export type ProjectionCertainty = "high" | "medium" | "low";
export type EventPlacement = "above" | "below";

export const EVENT_CATEGORIES = [
  "historical",
  "scientific",
  "technological",
  "space",
  "cultural",
] as const satisfies EventCategory[];

export const PROJECTION_TYPES = [
  "scheduled",
  "astronomical",
  "forecast",
  "speculative",
] as const satisfies ProjectionType[];

export const PROJECTION_CERTAINTIES = [
  "high",
  "medium",
  "low",
] as const satisfies ProjectionCertainty[];

/** Category metadata: display label + dot color */
export const CATEGORY_META: Record<EventCategory, { label: string; color: string }> = {
  historical:    { label: "Historical",    color: "#ef4444" },
  scientific:    { label: "Scientific",    color: "#22d3ee" },
  technological: { label: "Technological", color: "#a855f7" },
  space:         { label: "Space",         color: "#38bdf8" },
  cultural:      { label: "Cultural",      color: "#34d399" },
};

export const PROJECTION_TYPE_META: Record<ProjectionType, { label: string }> = {
  scheduled:    { label: "Scheduled" },
  astronomical: { label: "Astronomical" },
  forecast:     { label: "Forecast" },
  speculative:  { label: "Speculative" },
};

export const PROJECTION_CERTAINTY_META: Record<ProjectionCertainty, { label: string }> = {
  high:   { label: "High confidence" },
  medium: { label: "Medium confidence" },
  low:    { label: "Low confidence" },
};

type TimelineEventRawBase = {
  id: string;
  label: string;
  /** ISO date string YYYY-MM-DD */
  date: string;
  category: EventCategory;
  description?: string;
  placement?: EventPlacement;
};

/** Raw shape coming from public/data/historical-events.json */
export type HistoricalEventRaw = TimelineEventRawBase;

/** Raw shape coming from public/data/projected-events.json */
export type ProjectedEventRaw = TimelineEventRawBase & {
  projectionType: ProjectionType;
  certainty: ProjectionCertainty;
};

/** Parsed event with resolved timestamp */
export type HistoricalEventParsed = Omit<HistoricalEventRaw, "date"> & {
  /** Unix timestamp in ms */
  timestamp: number;
  dataset: "historical";
};

export type ProjectedEventParsed = Omit<ProjectedEventRaw, "date"> & {
  /** Unix timestamp in ms */
  timestamp: number;
  dataset: "projected";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const isEventCategory = (value: unknown): value is EventCategory =>
  typeof value === "string" && EVENT_CATEGORIES.includes(value as EventCategory);

export const isProjectionType = (value: unknown): value is ProjectionType =>
  typeof value === "string" && PROJECTION_TYPES.includes(value as ProjectionType);

export const isProjectionCertainty = (value: unknown): value is ProjectionCertainty =>
  typeof value === "string" && PROJECTION_CERTAINTIES.includes(value as ProjectionCertainty);

export const normalizeEventPlacement = (value: unknown): EventPlacement | undefined =>
  value === "above" || value === "below" ? value : undefined;

const parseTimestamp = (value: unknown): number | null => {
  if (!isString(value)) return null;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
};

const parseHistoricalEvent = (event: unknown): HistoricalEventParsed | null => {
  if (!isRecord(event)) return null;
  const timestamp = parseTimestamp(event.date);
  if (timestamp === null) return null;
  if (!isString(event.id) || !isString(event.label) || !isEventCategory(event.category)) return null;

  return {
    id: event.id,
    label: event.label,
    category: event.category,
    description: isString(event.description) ? event.description : undefined,
    placement: normalizeEventPlacement(event.placement),
    timestamp,
    dataset: "historical",
  };
};

const parseProjectedEvent = (event: unknown): ProjectedEventParsed | null => {
  if (!isRecord(event)) return null;
  const timestamp = parseTimestamp(event.date);
  if (timestamp === null) return null;
  if (
    !isString(event.id) ||
    !isString(event.label) ||
    !isEventCategory(event.category) ||
    !isProjectionType(event.projectionType) ||
    !isProjectionCertainty(event.certainty)
  ) {
    return null;
  }

  return {
    id: event.id,
    label: event.label,
    category: event.category,
    description: isString(event.description) ? event.description : undefined,
    placement: normalizeEventPlacement(event.placement),
    projectionType: event.projectionType,
    certainty: event.certainty,
    timestamp,
    dataset: "projected",
  };
};

export const parseHistoricalEvents = (raw: unknown): HistoricalEventParsed[] =>
  Array.isArray(raw)
    ? raw.flatMap(event => {
        const parsed = parseHistoricalEvent(event);
        return parsed ? [parsed] : [];
      })
    : [];

export const parseProjectedEvents = (raw: unknown): ProjectedEventParsed[] =>
  Array.isArray(raw)
    ? raw.flatMap(event => {
        const parsed = parseProjectedEvent(event);
        return parsed ? [parsed] : [];
      })
    : [];

