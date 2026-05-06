import { type AuthContextType, type User } from "../types/auth.types";
import { createContext, useEffect, useState } from "react";
import {
  getPersist,
  setIsAuthStorage,
  setPersistStorage,
} from "../utils/authStorage";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  persist: false,
  isAuth: false,
  setPersist: () => {},
  setIsAuth: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [persist, setPersist] = useState<boolean>(() => getPersist());
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    setPersistStorage(persist);
  }, [persist]);

  useEffect(() => {
    setIsAuthStorage(isAuth);
  }, [isAuth]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, persist, setPersist, isAuth, setIsAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
