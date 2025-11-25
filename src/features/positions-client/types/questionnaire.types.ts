export interface ApplicationFormQuestionnaireBase {
  name: string | null;
  template: boolean;
  sections: Section[] | [];
}

export interface ApplicationFormQuestionnaireDb
  extends ApplicationFormQuestionnaireBase {
  id: number;
}

export type ApplicationFormQuestionnaire =
  | ApplicationFormQuestionnaireBase
  | ApplicationFormQuestionnaireDb;

export interface SectionBase {
  name: string;
  questionnaires: Questionnaire[] | [];
}

export interface SectionDb extends SectionBase {
  id: number;
  _delete?: boolean;
}

export interface SectionLocal extends SectionBase {
  tempId: string;
}

export type Section = SectionLocal | SectionDb;

export interface QuestionnaireBase {
  question: string;
  description?: string;
  type: "Multiple Choice" | "Checkboxes" | "Text Entry" | "Paragraph";
  options?: QuestionOption[];
  parameter?: string;
}

export interface QuestionnaireDb extends QuestionnaireBase {
  id: number;
  _delete?: boolean;
}

export interface QuestionnaireLocal extends QuestionnaireBase {
  tempId: string;
}

export type Questionnaire = QuestionnaireDb | QuestionnaireLocal;

export interface QuestionOption {
  value: string;
  score: number;
}
