import { useQuery } from "@tanstack/react-query";
import { axiosPrivate } from "@/config/axios";

const businessUnitQueryKeys = {
  all: ["business-units"] as const,
};

export function useBusinessUnitsQuery() {
  const query = useQuery({
    queryKey: businessUnitQueryKeys.all,
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
