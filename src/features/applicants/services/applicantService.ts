import { axiosPrivate } from "@/config/axios";
import type { Applicant } from "../types/applicant.types";

export async function getApplicants(): Promise<Applicant[]> {
  const response = await axiosPrivate.get("/api/candidate/applications/");
  return response.data;
}

export async function getApplicantById(id: string | number): Promise<Applicant> {
  const response = await axiosPrivate.get("/api/candidate/applications/");
  const applicants: Applicant[] = response.data;
  const applicant = applicants.find((a) => String(a.id) === String(id));
  if (!applicant) throw new Error(`Applicant with id ${id} not found`);
  return applicant;
}
