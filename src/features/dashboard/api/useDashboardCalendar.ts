import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/query-keys";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { getDashboardCalendar } from "./dashboardApi";

export function useDashboardCalendar(month: number, year: number) {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: [...queryKeys.dashboard.all, "calendar", month, year] as const,
    queryFn: () => getDashboardCalendar(axiosPrivate, month, year),
  });
}
