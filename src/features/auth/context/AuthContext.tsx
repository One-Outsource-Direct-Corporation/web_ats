import { type AuthContextType, type User } from "../types/auth.types";
import { createContext, useState } from "react";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  persist: false,
  setPersist: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [persist, setPersist] = useState<boolean>(
    JSON.parse(localStorage.getItem("persist") || "false")
  );

  return (
    <AuthContext.Provider value={{ user, setUser, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};
