const IS_AUTH_KEY = "isAuth";

export const setIsAuthStorage = (value: boolean): void => {
  if (value) {
    localStorage.setItem(IS_AUTH_KEY, "true");
    return;
  }
  localStorage.removeItem(IS_AUTH_KEY);
};

export const clearAllAuthStorage = (): void => {
  localStorage.removeItem(IS_AUTH_KEY);
};
