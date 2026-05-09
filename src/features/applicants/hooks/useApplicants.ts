import { useQuery } from "@tanstack/react-query";
import { getApplicants } from "../services/applicantService";
import { queryKeys } from "@/shared/query-keys";

export function useApplicants() {
  return useQuery({
    queryKey: [...queryKeys.candidates.all, "all-applicants"],
    queryFn: getApplicants,
  });
}
