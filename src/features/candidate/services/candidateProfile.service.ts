import { axiosPrivate } from "@/config/axios";

export interface CandidateDetailsFile {
  filename: string;
  url: string;
}

export interface CandidateDetailsData {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  birth_date: string | null;
  gender: string | null;
  primary_contact_number: string;
  secondary_contact_number: string;
  email: string;
  linkedin_profile: string;
  address_line1: string;
  city: string;
  district: string;
  postal_code: string;
  country: string;
  highest_education: string;
  year_graduated: string;
  institution: string;
  program: string;
  work_experience: Array<{
    jobTitle: string;
    company: string;
    years: number;
  }>;
  resume: CandidateDetailsFile | null;
  photo_2x2: CandidateDetailsFile | null;
  medical_certificate: CandidateDetailsFile | null;
}

export interface CandidatePrefillData {
  personal_info: Record<string, string | number | null>;
  job_details: Record<string, unknown>;
  education_work: Record<string, unknown>;
  acknowledgement: Record<string, unknown>;
  files: {
    resume: CandidateDetailsFile | null;
    photo_2x2: CandidateDetailsFile | null;
    medical_certificate: CandidateDetailsFile | null;
  };
}

export interface CandidateProfileConfig {
  id: number;
  company: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  primary_contact_number: string;
  secondary_contact_number: string;
  email: string;
  linkedin_profile: string;
  address_line1: string;
  city: string;
  district: string;
  postal_code: string;
  country: string;
  highest_education: string;
  year_graduated: string;
  institution: string;
  program: string;
  work_experience: string;
  resume: string;
  photo_2x2: string;
  medical_certificate: string;
}

export interface CandidateEventData {
  id: number;
  job_title: string;
  process_type_label: string;
  scheduled_for: string;
  event_type: "interview" | "exam" | "orientation";
}

export const candidateProfileService = {
  async getDetails(): Promise<CandidateDetailsData> {
    const res = await axiosPrivate.get("/api/candidate/me/details/");
    return res.data;
  },

  async updateDetails(formData: FormData): Promise<CandidateDetailsData> {
    // The axiosPrivate instance has a default "Content-Type: application/json" header.
    // When sending FormData we must explicitly remove that header so the browser
    // can set "multipart/form-data" with the proper boundary automatically.
    const res = await axiosPrivate.put("/api/candidate/me/details/", formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return res.data;
  },

  async getPrefill(jobId: string | number): Promise<CandidatePrefillData> {
    const res = await axiosPrivate.get("/api/candidate/me/details/prefill/", {
      params: { job: jobId },
    });
    return res.data;
  },

  async getConfig(): Promise<CandidateProfileConfig> {
    const res = await axiosPrivate.get("/api/candidate/me/details/config/");
    return res.data;
  },

  async getEvents(): Promise<CandidateEventData[]> {
    const res = await axiosPrivate.get("/api/candidate/me/events/");
    return res.data;
  },
};
