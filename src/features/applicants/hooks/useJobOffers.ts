import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/query-keys";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import {
  getJobOffers,
  configureJobOffer,
  sendJobOffer,
  rescindJobOffer,
  previewJobOffer,
} from "../services/jobOfferService";
import type {
  ConfigureJobOfferPayload,
  SendJobOfferPayload,
  RescindJobOfferPayload,
} from "../types/jobOffer.types";

export function useJobOffersQuery(candidateId?: number) {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: queryKeys.jobOffers.list(candidateId),
    queryFn: () => getJobOffers(axiosPrivate, candidateId ? { candidate: candidateId } : undefined),
  });
}

export function useConfigureJobOffer() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfigureJobOfferPayload) => configureJobOffer(axiosPrivate, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobOffers.all });
    },
  });
}

export function useSendJobOffer() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendJobOfferPayload) => sendJobOffer(axiosPrivate, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobOffers.all });
    },
  });
}

export function useRescindJobOffer() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RescindJobOfferPayload) => rescindJobOffer(axiosPrivate, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobOffers.all });
    },
  });
}

export function usePreviewJobOffer() {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: (jobOfferId: number) => previewJobOffer(axiosPrivate, { job_offer_id: jobOfferId }),
  });
}
