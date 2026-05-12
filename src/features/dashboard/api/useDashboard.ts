import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/query-keys";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { getDashboard } from "./dashboardApi";

export function useDashboard() {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: queryKeys.dashboard.me(),
    queryFn: () => getDashboard(axiosPrivate),
  });
}
