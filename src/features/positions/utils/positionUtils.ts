import { FileText, Phone, Users, Calendar, Briefcase } from "lucide-react";

export const getProcessTypeIcon = (processType: string) => {
  switch (processType) {
    case "Resume Screening":
      return FileText;
    case "Phone Call Interview":
    case "Phone/Call Interview":
      return Phone;
    case "Shortlisted":
      return Users;
    case "Initial Interview":
    case "Set Schedule for Interview":
      return Calendar;
    case "Assessments":
      return FileText;
    case "Final Interview":
      return Users;
    case "For Job Offer":
    case "Job Offer":
      return Briefcase;
    case "For Offer and Finalization":
      return Briefcase;
    case "Onboarding":
      return Users;
    default:
      return FileText;
  }
};

export const formatTime = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(
    2,
    "0"
  )}:${seconds.padStart(2, "0")}`;
};

export const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  return { hours, minutes, seconds };
};

export const generateStepId = () => {
  return Date.now();
};

export const generateAssessmentId = () => {
  return Date.now();
};

export const generateQuestionId = () => {
  return Date.now();
};
