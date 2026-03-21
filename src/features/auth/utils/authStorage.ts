const PERSIST_KEY = "persist";
const IS_AUTH_KEY = "isAuth";

const parseBoolean = (raw: string | null, fallback = false): boolean => {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const getPersist = (): boolean => {
  return parseBoolean(localStorage.getItem(PERSIST_KEY), false);
};

export const setPersistStorage = (value: boolean): void => {
  if (value) {
    localStorage.setItem(PERSIST_KEY, "true");
    return;
  }
  localStorage.removeItem(PERSIST_KEY);
};

export const getIsAuth = (): boolean => {
  return parseBoolean(localStorage.getItem(IS_AUTH_KEY), false);
};

export const setIsAuthStorage = (value: boolean): void => {
  if (value) {
    localStorage.setItem(IS_AUTH_KEY, "true");
    return;
  }
  localStorage.removeItem(IS_AUTH_KEY);
};

export const clearAllAuthStorage = (): void => {
  localStorage.removeItem(PERSIST_KEY);
  localStorage.removeItem(IS_AUTH_KEY);
};
