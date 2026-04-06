import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { clientService } from "@/features/client/services/client.service";
import type {
  ClientEntity,
  ClientListResponse,
} from "@/features/client/types/client.types";

const clientQueryKeys = {
  all: ["client"] as const,
  infinite: (search = "") =>
    [...clientQueryKeys.all, "infinite", search] as const,
};

interface UseClientQueryParams {
  initialSearch?: string;
  enabled?: boolean;
  debounceMs?: number;
}

const getNextPageParam = (nextUrl: string | null): number | undefined => {
  if (!nextUrl) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(nextUrl, "http://localhost");
    const pageParam = parsedUrl.searchParams.get("page");

    if (!pageParam) {
      return undefined;
    }

    const page = Number(pageParam);
    return Number.isNaN(page) ? undefined : page;
  } catch {
    return undefined;
  }
};

const flattenUniqueClients = (
  pages: ClientListResponse[] | undefined,
): ClientEntity[] => {
  if (!pages) {
    return [];
  }

  const visitedIds = new Set<number>();
  const clients: ClientEntity[] = [];

  for (const page of pages) {
    for (const client of page.results) {
      if (!visitedIds.has(client.id)) {
        visitedIds.add(client.id);
        clients.push(client);
      }
    }
  }

  return clients;
};

export function useClientQuery(params: UseClientQueryParams = {}) {
  const { initialSearch = "", enabled = true, debounceMs = 300 } = params;

  const axiosPrivate = useAxiosPrivate();
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [search, debounceMs]);

  const query = useInfiniteQuery({
    queryKey: clientQueryKeys.infinite(debouncedSearch),
    initialPageParam: 1,
    enabled,
    queryFn: ({ pageParam, signal }) =>
      clientService.getClientsResponse(
        {
          page: typeof pageParam === "number" ? pageParam : 1,
          search: debouncedSearch || undefined,
        },
        {
          httpClient: axiosPrivate,
          signal,
        },
      ),
    getNextPageParam: (lastPage) => getNextPageParam(lastPage.next),
  });

  const clients = useMemo(
    () => flattenUniqueClients(query.data?.pages),
    [query.data?.pages],
  );

  return {
    clients,
    pages: query.data?.pages ?? [],
    search,
    debouncedSearch,
    setSearch,
    loadMore: query.fetchNextPage,
    hasMore: query.hasNextPage,
    totalCount: query.data?.pages?.[0]?.count ?? 0,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    error: query.error,
    refetch: query.refetch,
  };
}
