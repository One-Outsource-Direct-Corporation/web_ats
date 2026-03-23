import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { externalPostingService } from "@/features/external_posting/services/externalPosting.service";
import { queryKeys } from "@/shared/query-keys";

export function useExternalPostingClientsQuery() {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: queryKeys.externalPosting.clients(),
    queryFn: () =>
      externalPostingService.getClientsResponse({
        httpClient: axiosPrivate,
      }),
  });

  return {
    clients: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? "Failed to fetch clients" : null,
    refetch: query.refetch,
  };
}
