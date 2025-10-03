import { type AuthContextType, type User } from "../types/auth.types";
import { createContext, useState } from "react";

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
  const [persist, setPersist] = useState<boolean>(
    JSON.parse(localStorage.getItem("persist") || "false")
  );
  const [isAuth, setIsAuth] = useState<boolean>(
    JSON.parse(localStorage.getItem("isAuth") || "false")
  );

  return (
    <AuthContext.Provider
      value={{ user, setUser, persist, setPersist, isAuth, setIsAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
