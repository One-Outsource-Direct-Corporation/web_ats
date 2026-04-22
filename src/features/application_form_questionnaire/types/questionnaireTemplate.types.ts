export interface QuestionnaireTemplateQuestion {
  id: number;
  question: string;
  description: string;
  question_type: "multiple_choices" | "checkboxes" | "paragraph";
  options: Array<{ value: string; score: number }>;
  parameter: string;
  is_non_negotiable?: boolean;
  non_negotiable_value?: string | number | boolean | string[] | null;
}

export interface QuestionnaireTemplateSection {
  id: number;
  name: string;
  questionnaires: QuestionnaireTemplateQuestion[];
}

export interface QuestionnaireTemplate {
  id: number;
  name: string;
  updated_at: string;
  sections: QuestionnaireTemplateSection[];
}

export interface QuestionnaireTemplateQuestionPayload {
  id?: number;
  question: string;
  description?: string;
  question_type: "multiple_choices" | "checkboxes" | "paragraph";
  options?: Array<{ value: string; score: number }>;
  parameter?: string;
  is_non_negotiable?: boolean;
  non_negotiable_value?: string | number | boolean | string[] | null;
  is_active?: boolean;
  _delete?: boolean;
}

export interface QuestionnaireTemplateSectionPayload {
  id?: number;
  name: string;
  questionnaires?: QuestionnaireTemplateQuestionPayload[];
  _delete?: boolean;
}

export interface ApplicationFormQuestionnaireTemplatePayload {
  id?: number;
  name: string;
  is_active?: boolean;
  sections?: QuestionnaireTemplateSectionPayload[];
}

export interface QuestionnaireTemplateDetail extends QuestionnaireTemplate {
  is_active: boolean;
  created_at: string;
}

export interface QuestionnaireTemplateListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: QuestionnaireTemplate[];
}

export interface QuestionnaireTemplateListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface QuestionnaireTemplateDetailParams {
  id: number;
}

export type CreateQuestionnaireTemplatePayload =
  ApplicationFormQuestionnaireTemplatePayload;
export type UpdateQuestionnaireTemplatePayload =
  Partial<ApplicationFormQuestionnaireTemplatePayload>;
