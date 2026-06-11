import { useEffect, useRef, useState } from "react";

export type ResourceStatus = "idle" | "loading" | "success" | "error";

export type JsonResourceResult<T> = {
  data: T;
  status: ResourceStatus;
  error: string | null;
};

type JsonResourceCache<T> = {
  loaded: boolean;
  value: T | null;
};

type UseJsonResourceOptions<T> = {
  url: string;
  cache: JsonResourceCache<T>;
  initialValue: T;
  parse: (raw: unknown) => T;
  errorPrefix: string;
};

export const createJsonResourceCache = <T,>(): JsonResourceCache<T> => ({
  loaded: false,
  value: null,
});

export function useJsonResource<T>({
  url,
  cache,
  initialValue,
  parse,
  errorPrefix,
}: UseJsonResourceOptions<T>): JsonResourceResult<T> {
  const [data, setData] = useState<T>(cache.loaded ? (cache.value as T) : initialValue);
  const [status, setStatus] = useState<ResourceStatus>(cache.loaded ? "success" : "idle");
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (cache.loaded || fetchedRef.current) return;
    fetchedRef.current = true;

    const controller = new AbortController();
    setStatus("loading");

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<unknown>;
      })
      .then(raw => {
        const parsed = parse(raw);
        cache.loaded = true;
        cache.value = parsed;
        setData(parsed);
        setStatus("success");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[${errorPrefix}]`, msg);
        setError(msg);
        setStatus("error");
      });

    return () => {
      controller.abort();
    };
  }, [cache, errorPrefix, parse, url]);

  return { data, status, error };
}
