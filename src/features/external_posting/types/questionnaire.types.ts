export interface ApplicationFormQuestionnaireBase {
	name: string | null;
	template: boolean;
	sections: Section[] | [];
}

export interface ApplicationFormQuestionnaireDb
	extends ApplicationFormQuestionnaireBase {
	id: number;
}

export type QuestionnaireResponse = ApplicationFormQuestionnaireDb;
export type CreateQuestionnairePayload = ApplicationFormQuestionnaireBase;
export type UpdateQuestionnairePayload =
	Partial<ApplicationFormQuestionnaireBase>;

export interface GetQuestionnaireParams {
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

export const QuestionType = {
	MULTIPLE_CHOICES: "multiple_choices",
	CHECKBOXES: "checkboxes",
	PARAGRAPH: "paragraph",
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export interface QuestionnaireBase {
	question: string;
	description?: string;
	question_type: QuestionType;
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