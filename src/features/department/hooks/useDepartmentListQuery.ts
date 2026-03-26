import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { departmentService } from "@/features/department/services/department.service";

const departmentListQueryKeys = {
  all: ["department", "list"] as const,
};

export function useDepartmentListQuery() {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: departmentListQueryKeys.all,
    queryFn: () =>
      departmentService.getAllDepartmentsResponse(
        {},
        {
          httpClient: axiosPrivate,
        },
      ),
  });

  return {
    departments: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? "Failed to fetch departments" : null,
    refetch: query.refetch,
  };
}
