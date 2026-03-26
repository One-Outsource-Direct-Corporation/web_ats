export interface ClientBase {
  name: string;
  email: string;
  contact_number: string;
}

export interface ClientEntity extends ClientBase {
  id: number;
  active: boolean;
  posted_by: number | null;
  created_at: string;
  updated_at: string;
}

export type ClientResponse = ClientEntity;
export type CreateClientPayload = ClientBase;
export type Client = ClientEntity | ClientBase;

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type ClientListResponse = PaginatedResponse<ClientEntity>;

export interface ClientListQueryParams {
  page?: number;
  search?: string;
}
