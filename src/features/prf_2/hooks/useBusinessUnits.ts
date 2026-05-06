import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { queryKeys } from "@/shared/query-keys";

export function useBusinessUnitsQuery() {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: queryKeys.businessUnits.listing(),
    queryFn: async ({ signal }) => {
      const res = await axiosPrivate.get("/api/core/business-unit/", { signal });
      return res.data.results || res.data || [];
    },
  });

  return {
    businessUnits: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? "Failed to fetch business units" : null,
    refetch: query.refetch,
  };
}
