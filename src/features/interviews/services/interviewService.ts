import type { InterviewEvaluation } from "../entities/InterviewEvaluation";

export async function getInterviewEvaluations(
  applicantId: string
): Promise<InterviewEvaluation[]> {
  // TODO: Replace with actual API call
  return [
    {
      id: "1",
      applicantId,
      interviewer: "Jane HR",
      date: "2025-09-10",
      score: 85,
      comments: "Strong communication skills.",
      stage: "Initial Interview",
    },
    {
      id: "2",
      applicantId,
      interviewer: "John Manager",
      date: "2025-09-11",
      score: 90,
      comments: "Excellent technical depth.",
      stage: "Final Interview",
    },
  ];
}
