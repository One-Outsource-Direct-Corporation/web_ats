// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: "admin" | "applicant" | "hr";
//   avatar?: string;
// }

import type { AxiosResponse } from "axios";

export interface User {
  id: string;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  department: string;
  role: string;
  access: string;
}

export interface AuthState {
  user: User | null;
  isAuthChecking: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access: string;
}

export interface AuthContextType extends AuthState {
  login: (
    credentials: LoginCredentials
  ) => Promise<AxiosResponse<AuthResponse>>;
  logout: () => Promise<void>;
}
