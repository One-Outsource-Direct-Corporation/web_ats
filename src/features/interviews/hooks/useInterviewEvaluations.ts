import { useState, useEffect } from "react";
import type { InterviewEvaluation } from "../types/InterviewEvaluation";
import { getInterviewEvaluations } from "../services/interviewService";

export function useInterviewEvaluations(applicantId: string) {
  const [evaluations, setEvaluations] = useState<InterviewEvaluation[]>([]);
  useEffect(() => {
    if (!applicantId) return;
    getInterviewEvaluations(applicantId).then(setEvaluations);
  }, [applicantId]);
  return evaluations;
}
