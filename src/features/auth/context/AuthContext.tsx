import { type AuthContextType, type User } from "../types/auth.types";
import { createContext, useEffect, useState } from "react";
import { setIsAuthStorage } from "../utils/authStorage";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuth: false,
  setIsAuth: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthStorage(isAuth);
  }, [isAuth]);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
