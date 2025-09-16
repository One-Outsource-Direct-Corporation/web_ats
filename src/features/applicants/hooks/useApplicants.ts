import { useState, useEffect } from "react";
import type { Applicant } from "../types/Applicant";
import { getApplicants } from "../../../services/applicantService";

export function useApplicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  useEffect(() => {
    getApplicants().then(setApplicants);
  }, []);
  return applicants;
}
