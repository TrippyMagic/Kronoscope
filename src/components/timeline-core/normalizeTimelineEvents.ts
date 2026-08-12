import type { TimelineEvent } from "../timeline/types";

export const normalizeTimelineEvents = (events: TimelineEvent[]): TimelineEvent[] => {
  const seenIds = new Set<string>();
  const normalized: TimelineEvent[] = [];

  for (const event of events) {
    if (!event.id || seenIds.has(event.id) || !Number.isFinite(event.value)) continue;
    seenIds.add(event.id);
    normalized.push(event);
  }

  return normalized;
};
