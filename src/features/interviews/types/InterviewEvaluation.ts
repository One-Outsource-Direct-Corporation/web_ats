export interface InterviewEvaluation {
  id: string;
  applicantId: string;
  interviewer: string;
  date: string;
  score: number;
  comments?: string;
  stage: string;
}
