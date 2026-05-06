import type { ClientEntity } from "@/features/client";
import type { DepartmentEntity } from "@/features/department";

export interface Company {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  address?: string;
  contact?: string;
}

export interface BusinessUnit {
  id: number;
  name: string;
  slug: string;
  company?: Company;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  company: Company | null;
  business_unit: BusinessUnit | null;
  department: DepartmentEntity;
  client: ClientEntity | null;
  role: string;
  is_staff: boolean;
}

export interface AuthState {
  user: User | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
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
