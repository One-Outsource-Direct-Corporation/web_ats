import { axiosPrivate } from "@/config/axios";
import type { AxiosInstance } from "axios";
import type {
  ClientEntity,
  ClientListQueryParams,
  ClientListResponse,
} from "@/features/client/types/client.types";

const buildClientListQuery = (params: ClientListQueryParams = {}): string => {
  const query = new URLSearchParams();

  if (typeof params.page === "number") {
    query.set("page", String(params.page));
  }

  const trimmedSearch = params.search?.trim();
  if (trimmedSearch) {
    query.set("search", trimmedSearch);
  }

  return query.toString();
};

export const clientService = {
  async getClientsResponse(
    params: ClientListQueryParams = {},
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<ClientListResponse> {
    const httpClient = options?.httpClient ?? axiosPrivate;
    const query = buildClientListQuery(params);
    const url = query ? `/api/client/?${query}` : "/api/client/";

    const response = await httpClient.get<ClientListResponse>(url, {
      signal: options?.signal,
    });

    return response.data;
  },

  async getAllClientsResponse(
    params: Omit<ClientListQueryParams, "page"> = {},
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<ClientEntity[]> {
    const httpClient = options?.httpClient ?? axiosPrivate;
    const firstPage = await clientService.getClientsResponse(
      {
        ...params,
        page: 1,
      },
      options,
    );

    const clients = [...firstPage.results];
    let nextUrl = firstPage.next;

    while (nextUrl) {
      const response = await httpClient.get<ClientListResponse>(nextUrl, {
        signal: options?.signal,
      });

      clients.push(...response.data.results);
      nextUrl = response.data.next;
    }

    return clients;
  },
};
