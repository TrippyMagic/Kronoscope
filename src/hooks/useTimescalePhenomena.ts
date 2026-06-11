/**
 * src/hooks/useTimescalePhenomena.ts
 * Fetches and caches timescale phenomena from /data/timescale-phenomena.json.
 * Same module-level cache pattern as useHistoricalEvents.
 */
import {
  parseTimescalePhenomena,
  type TimescalePhenomenon,
} from "../types/phenomena";
import {
  createJsonResourceCache,
  useJsonResource,
  type ResourceStatus,
} from "../utils/fetchJsonResource";

type UseTimescalePhenomenaResult = {
  phenomena: TimescalePhenomenon[];
  status: ResourceStatus;
  error: string | null;
};

const cache = createJsonResourceCache<TimescalePhenomenon[]>();

export function useTimescalePhenomena(): UseTimescalePhenomenaResult {
  const { data, status, error } = useJsonResource({
    url: "/data/timescale-phenomena.json",
    cache,
    initialValue: [],
    parse: parseTimescalePhenomena,
    errorPrefix: "useTimescalePhenomena",
  });

  return { phenomena: data, status, error };
}

