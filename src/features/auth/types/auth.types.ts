// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: "admin" | "applicant" | "hr";
//   avatar?: string;
// }

export interface User {
  id: number;
  full_name: string;
  email: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  business_unit: string;
  department: string;
  role: string;
  is_staff: boolean;
  // access: string;
}

export interface AuthState {
  user: User | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  detail?: string;
  authenticated?: boolean;
  user: User;
}

export interface AuthContextType extends AuthState {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  persist: boolean;
  isAuth: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}
