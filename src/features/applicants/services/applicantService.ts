import { axiosPrivate } from "@/config/axios";
import type { Applicant, Comment } from "../types/applicant.types";

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

export async function getComments(applicationId: number): Promise<Comment[]> {
  const response = await axiosPrivate.get("/api/candidate/comments/", {
    params: { candidate_application_id: applicationId },
  });
  return response.data;
}

export async function createComment(
  applicationId: number,
  content: string,
): Promise<Comment> {
  const response = await axiosPrivate.post("/api/candidate/comments/", {
    candidate_application: applicationId,
    content,
  });
  return response.data;
}

export async function deleteComment(commentId: number): Promise<void> {
  await axiosPrivate.delete(`/api/candidate/comments/${commentId}/`);
}
