// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: "admin" | "applicant" | "hr";
//   avatar?: string;
// }

import type { ClientEntity } from "@/features/client";
import type { DepartmentEntity } from "@/features/department";
import type { BusinessUnit } from "@/features/prf_2/types/enums/BusinessUnit";

export interface User {
  id: number;
  email: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  business_unit: BusinessUnit;
  department: DepartmentEntity;
  client: ClientEntity | null;
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
