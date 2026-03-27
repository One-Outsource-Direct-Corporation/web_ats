export interface QuestionnaireTemplateQuestion {
  id: number;
  question: string;
  description: string;
  question_type: "multiple_choices" | "checkboxes" | "paragraph";
  options: Array<{ value: string; score: number }>;
  parameter: string;
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
