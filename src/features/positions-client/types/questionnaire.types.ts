export interface QuestionOption {
  value: string;
  score: number;
}

export interface Question {
  text: string;
  desc: string;
  type: "Multiple Choice" | "Checkboxes" | "Text Entry" | "Paragraph";
  mode: string;
  options?: QuestionOption[];
  parameter?: string;
}

export interface Section {
  name: string;
  questions?: Question[];
}

export interface Questionnaire {
  name: string;
  sections: Section[];
}
