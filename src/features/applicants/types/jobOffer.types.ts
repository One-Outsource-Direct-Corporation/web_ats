export interface JobOffer {
  id: number;
  candidate_application_id: number;
  candidate_name: string;
  pipeline_step: number | null;
  pipeline_step_title: string;
  daily_rate: string | null;
  minimum_wage: string | null;
  basic_pay: string | null;
  allowance: string | null;
  transportation: string | null;
  mobile_allowance: string | null;
  vacation_leave_credits: string;
  sick_leave_credits: string;
  benefits: Record<string, boolean>;
  start_date: string | null;
  email_template: number | null;
  email_template_name: string;
  email_subject: string;
  email_body: string;
  email_sent_at: string | null;
  status: "draft" | "sent" | "signed" | "rescinded";
  reference_id: string | null;
  date_sent: string | null;
  signed_document: number | null;
  signed_document_url: string;
  signed_at: string | null;
  offer_document: number | null;
  offer_document_url: string | null;
  rescind_reason: string;
  rescind_remarks: string;
  rescinded_at: string | null;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface ConfigureJobOfferPayload {
  candidate_application_id: number;
  pipeline_step_id?: number | null;
  daily_rate?: string | null;
  minimum_wage?: string | null;
  basic_pay?: string | null;
  allowance?: string | null;
  transportation?: string | null;
  mobile_allowance?: string | null;
  vacation_leave_credits?: string;
  sick_leave_credits?: string;
  benefits?: Record<string, boolean>;
  start_date: string;
  email_template_id?: number | null;
  email_subject?: string;
  email_body?: string;
}

export interface SendJobOfferPayload {
  job_offer_id: number;
}

export interface RescindJobOfferPayload {
  job_offer_id: number;
  reason?: string;
  remarks?: string;
}

export interface PreviewJobOfferPayload {
  job_offer_id: number;
}
