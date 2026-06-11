/**
 * src/hooks/useHistoricalEvents.ts
 * Fetches and caches historical events from /data/historical-events.json.
 * Converts raw date strings to Unix timestamps (ms) once on load.
 */
import {
  parseHistoricalEvents,
  type HistoricalEventParsed,
} from "../types/events";
import {
  createJsonResourceCache,
  useJsonResource,
  type ResourceStatus,
} from "../utils/fetchJsonResource";

type UseHistoricalEventsResult = {
  events: HistoricalEventParsed[];
  status: ResourceStatus;
  error: string | null;
};

/** Module-level cache so the JSON is fetched only once per session */
const cache = createJsonResourceCache<HistoricalEventParsed[]>();

export function useHistoricalEvents(): UseHistoricalEventsResult {
  const { data, status, error } = useJsonResource({
    url: "/data/historical-events.json",
    cache,
    initialValue: [],
    parse: parseHistoricalEvents,
    errorPrefix: "useHistoricalEvents",
  });

  return { events: data, status, error };
}

