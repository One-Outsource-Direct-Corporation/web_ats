import type { PositionFormData } from "@/features/positions-client/types/create_position.types";
import DOMPurify from "dompurify";
import { formatForJSON } from "./formatName";

export function stateToDataFormatClient(formData: PositionFormData) {
  // TODO: change the data structure from changes made
  return {
    job_posting: {
      job_title: formData.job_posting.job_title,
      target_start_date: formData.job_posting.target_start_date,
      reason_for_posting: formatForJSON(
        formData.job_posting.reason_for_posting ?? ""
      ),
      other_reason_for_posting:
        formData.job_posting.reason_for_posting !== "others"
          ? ""
          : formatForJSON(formData.job_posting.other_reason_for_posting ?? ""),
      department_name: formatForJSON(formData.job_posting.department ?? ""),
      department_name_other:
        formData.job_posting.department !== "other"
          ? ""
          : formatForJSON(formData.job_posting.other_department ?? ""),
      number_of_vacancies:
        Number(formData.job_posting.number_of_vacancies) || 1,
      employment_type: formData.employment_type,
      work_setup: formatForJSON(formData.work_setup),
      working_site: formData.working_site,
      min_salary: Number(formData.min_budget) || 0,
      max_salary: Number(formData.max_budget) || 0,
      description: DOMPurify.sanitize(formData.description),
      responsibilities: DOMPurify.sanitize(formData.responsibilities),
      qualifications: DOMPurify.sanitize(formData.qualifications),
      application_form: { ...formData.application_form },
      pipeline: [...formData.pipeline],
      non_negotiables: formData.non_negotiables,
      section_questionnaires: {
        name: "",
        questionnaires: [
          { question: "", description: "", question_type: "text" },
        ],
      },
    },
    client: formData.client,
    education_level: formData.education_level,
    experience_level: formData.experience_level,
  };
}
