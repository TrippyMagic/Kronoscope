import { useEffect, useState } from "react";

export type ResourceStatus = "idle" | "loading" | "success" | "error";

export type JsonResourceResult<T> = {
  data: T;
  status: ResourceStatus;
  error: string | null;
};

type JsonResourceCache<T> = {
  status: ResourceStatus;
  value: T | null;
  error: string | null;
  promise: Promise<T> | null;
};

type UseJsonResourceOptions<T> = {
  url: string;
  cache: JsonResourceCache<T>;
  initialValue: T;
  parse: (raw: unknown) => T;
  errorPrefix: string;
};

export const createJsonResourceCache = <T,>(): JsonResourceCache<T> => ({
  status: "idle",
  value: null,
  error: null,
  promise: null,
});

export function useJsonResource<T>({
  url,
  cache,
  initialValue,
  parse,
  errorPrefix,
}: UseJsonResourceOptions<T>): JsonResourceResult<T> {
  const [data, setData] = useState<T>(cache.status === "success" ? (cache.value as T) : initialValue);
  const [status, setStatus] = useState<ResourceStatus>(cache.status);
  const [error, setError] = useState<string | null>(cache.error);

  useEffect(() => {
    let active = true;

    if (cache.status === "success" && cache.value !== null) {
      setData(cache.value);
      setStatus("success");
      setError(null);
      return () => {
        active = false;
      };
    }

    if (cache.status === "error") {
      setStatus("error");
      setError(cache.error);
      return () => {
        active = false;
      };
    }

    if (!cache.promise) {
      cache.status = "loading";
      cache.error = null;
      cache.promise = fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json() as Promise<unknown>;
        })
        .then(raw => {
          const parsed = parse(raw);
          cache.status = "success";
          cache.value = parsed;
          return parsed;
        })
        .catch((err: unknown) => {
          const msg = err instanceof Error ? err.message : String(err);
          console.error(`[${errorPrefix}]`, msg);
          cache.status = "error";
          cache.error = msg;
          throw err;
        })
        .finally(() => {
          cache.promise = null;
        });
    }

    const promise = cache.promise;
    if (!promise) return;

    setStatus("loading");
    setError(null);

    promise
      .then(parsed => {
        if (!active) return;
        setData(parsed);
        setStatus("success");
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
        setError(cache.error);
      });

    return () => {
      active = false;
    };
  }, [cache, errorPrefix, parse, url]);

  return { data, status, error };
}
