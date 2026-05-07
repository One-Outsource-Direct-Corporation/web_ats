import type {
  JobOffer,
  ConfigureJobOfferPayload,
  SendJobOfferPayload,
  RescindJobOfferPayload,
  PreviewJobOfferPayload,
} from "../types/jobOffer.types";
import type { AxiosInstance } from "axios";

const BASE = "/api/candidate/job-offers";

export async function getJobOffers(
  axiosPrivate: AxiosInstance,
  params?: { candidate?: number },
): Promise<JobOffer[]> {
  const res = await axiosPrivate.get(BASE, { params });
  return res.data;
}

export async function getJobOffer(
  axiosPrivate: AxiosInstance,
  id: number,
): Promise<JobOffer> {
  const offers = await getJobOffers(axiosPrivate, { candidate: id });
  return offers[0];
}

export async function configureJobOffer(
  axiosPrivate: AxiosInstance,
  data: ConfigureJobOfferPayload,
): Promise<JobOffer> {
  const res = await axiosPrivate.post(`${BASE}/configure/`, data);
  return res.data;
}

export async function sendJobOffer(
  axiosPrivate: AxiosInstance,
  data: SendJobOfferPayload,
): Promise<JobOffer> {
  const res = await axiosPrivate.patch(`${BASE}/send/`, data);
  return res.data;
}

export async function rescindJobOffer(
  axiosPrivate: AxiosInstance,
  data: RescindJobOfferPayload,
): Promise<JobOffer> {
  const res = await axiosPrivate.patch(`${BASE}/rescind/`, data);
  return res.data;
}

export async function previewJobOffer(
  axiosPrivate: AxiosInstance,
  data: PreviewJobOfferPayload,
): Promise<Blob> {
  const res = await axiosPrivate.post(`${BASE}/preview/`, data, {
    responseType: "blob",
  });
  return res.data;
}
