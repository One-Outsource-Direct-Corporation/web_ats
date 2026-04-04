import type {BusinessUnit} from "@/features/prf_2/types/enums/BusinessUnit.ts";

export interface DepartmentBase {
  name: string;
  business_unit: BusinessUnit | null;
}

export interface DepartmentEntitySimple extends Omit<
  DepartmentBase,
  "business_unit"
> {
  id: number;
  name: string;
}

export interface DepartmentEntity extends DepartmentBase {
  id: number;
  posted_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface DepartmentPostedByUser {
  id: number;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  role: string;
}

export interface DepartmentNestedEntity extends DepartmentBase {
  id: number;
  posted_by: DepartmentPostedByUser | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type DepartmentListResponse = PaginatedResponse<DepartmentEntity>;

export interface DepartmentListQueryParams {
  page?: number;
  search?: string;
  nested?: boolean;
  business_unit?: BusinessUnit;
}

export type CreateDepartmentPayload = DepartmentBase;
