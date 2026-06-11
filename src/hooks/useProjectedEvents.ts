/**
 * src/hooks/useProjectedEvents.ts
 * Fetches and caches future projections from /data/projected-events.json.
 * Converts raw date strings to Unix timestamps (ms) once on load.
 */
import {
  parseProjectedEvents,
  type ProjectedEventParsed,
} from "../types/events";
import {
  createJsonResourceCache,
  useJsonResource,
  type ResourceStatus,
} from "../utils/fetchJsonResource";

type UseProjectedEventsResult = {
  events: ProjectedEventParsed[];
  status: ResourceStatus;
  error: string | null;
};

const cache = createJsonResourceCache<ProjectedEventParsed[]>();

export function useProjectedEvents(): UseProjectedEventsResult {
  const { data, status, error } = useJsonResource({
    url: "/data/projected-events.json",
    cache,
    initialValue: [],
    parse: parseProjectedEvents,
    errorPrefix: "useProjectedEvents",
  });

  return { events: data, status, error };
}

