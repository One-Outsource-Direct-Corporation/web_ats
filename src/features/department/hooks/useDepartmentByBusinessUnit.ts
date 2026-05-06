import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { departmentService } from "@/features/department/services/department.service";

const departmentListQueryKeys = {
  all: ["department", "list"] as const,
  businessUnit: (businessUnit: string | "all") =>
    [...departmentListQueryKeys.all, businessUnit] as const,
};

export function useDepartmentByBusinessUnit(
  business_unit: string | undefined,
) {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: departmentListQueryKeys.businessUnit(business_unit ?? "all"),
    enabled: Boolean(business_unit),
    queryFn: ({ signal }) =>
      departmentService
        .getDepartmentsResponse(
          { business_unit: business_unit as string },
          {
            httpClient: axiosPrivate,
            signal,
          },
        )
        .then((response) => response.results),
  });

  return {
    departments: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? "Failed to fetch departments" : null,
    refetch: query.refetch,
  };
}

export function useDepartmentListQuery() {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: departmentListQueryKeys.all,
    queryFn: ({ signal }) =>
      departmentService
        .getDepartmentsResponse(
          {},
          {
            httpClient: axiosPrivate,
            signal,
          },
        )
        .then((response) => response.results),
  });

  return {
    departments: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? "Failed to fetch departments" : null,
    refetch: query.refetch,
  };
}
