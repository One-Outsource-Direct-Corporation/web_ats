import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { clientService } from "@/features/client/services/client.service";

const clientListQueryKeys = {
  all: ["client", "list"] as const,
};

export function useClientListQuery() {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: clientListQueryKeys.all,
    queryFn: () =>
      clientService.getAllClientsResponse(
        {},
        {
          httpClient: axiosPrivate,
        },
      ),
  });

  return {
    clients: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? "Failed to fetch clients" : null,
    refetch: query.refetch,
  };
}
