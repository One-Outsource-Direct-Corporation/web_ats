// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useInterviewEvaluations } from "@/features/interviews/useInterviewEvaluations";
import { useNavigate } from "react-router-dom";

export default function InterviewEvaluationForm() {
  const applicantId = "1"; // TODO: get from props or route
  const evaluations = useInterviewEvaluations(applicantId);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Interview Evaluations</h2>
        <ul>
          {evaluations.map((ev) => (
            <li key={ev.id} className="mb-4 p-4 border rounded">
              <div>
                <strong>Interviewer:</strong> {ev.interviewer}
              </div>
              <div>
                <strong>Date:</strong> {ev.date}
              </div>
              <div>
                <strong>Score:</strong> {ev.score}
              </div>
              <div>
                <strong>Stage:</strong> {ev.stage}
              </div>
              {ev.comments && (
                <div>
                  <strong>Comments:</strong> {ev.comments}
                </div>
              )}
            </li>
          ))}
        </ul>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
    </div>
  );
}
