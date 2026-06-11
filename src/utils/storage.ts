export const readStorageString = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writeStorageString = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* noop */
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* noop */
  }
};

export const readStorageJson = <T,>(key: string, fallback: T): T => {
  const raw = readStorageString(key);
  if (raw === null) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const writeStorageJson = (key: string, value: unknown): void => {
  writeStorageString(key, JSON.stringify(value));
};
