/**
 * src/hooks/useGeologicalEras.ts
 * Fetches and caches the geological/cosmic explorer data
 * from /data/geological-eras.json.
 * Same module-level cache pattern used throughout the project.
 */
import {
  parseGeoExplorerData,
  type GeoExplorerData,
} from "../types/geological";
import {
  createJsonResourceCache,
  useJsonResource,
  type ResourceStatus,
} from "../utils/fetchJsonResource";

export type UseGeologicalErasResult = {
  data: GeoExplorerData | null;
  status: ResourceStatus;
  error: string | null;
};

const cache = createJsonResourceCache<GeoExplorerData | null>();

export function useGeologicalEras(): UseGeologicalErasResult {
  const { data, status, error } = useJsonResource({
    url: "/data/geological-eras.json",
    cache,
    initialValue: null,
    parse: parseGeoExplorerData,
    errorPrefix: "useGeologicalEras",
  });

  return { data, status, error };
}

