import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { departmentService } from "@/features/department/services/department.service";
import type {
  DepartmentEntity,
  DepartmentListResponse,
} from "@/features/department/types/department.types";

const departmentQueryKeys = {
  all: ["department"] as const,
  infinite: (search = "") =>
    [...departmentQueryKeys.all, "infinite", search] as const,
};

interface UseDepartmentQueryParams {
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

const flattenUniqueDepartments = (
  pages: DepartmentListResponse[] | undefined,
): DepartmentEntity[] => {
  if (!pages) {
    return [];
  }

  const visitedIds = new Set<number>();
  const departments: DepartmentEntity[] = [];

  for (const page of pages) {
    for (const department of page.results) {
      if (!visitedIds.has(department.id)) {
        visitedIds.add(department.id);
        departments.push(department);
      }
    }
  }

  return departments;
};

export function useDepartmentQuery(params: UseDepartmentQueryParams = {}) {
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
    queryKey: departmentQueryKeys.infinite(debouncedSearch),
    initialPageParam: 1,
    enabled,
    queryFn: ({ pageParam, signal }) =>
      departmentService.getDepartmentsResponse(
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

  const departments = useMemo(
    () => flattenUniqueDepartments(query.data?.pages),
    [query.data?.pages],
  );

  return {
    departments,
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
