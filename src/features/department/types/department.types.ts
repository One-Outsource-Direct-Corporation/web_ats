export interface DepartmentBase {
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
}

export type CreateDepartmentPayload = DepartmentBase;
