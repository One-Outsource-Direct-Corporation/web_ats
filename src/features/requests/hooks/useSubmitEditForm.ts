import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type { JobPostingResponsePRF } from "@/features/jobs/types/job.types";
import { formatForJSON } from "@/shared/utils/formatName";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";

export default function useSubmitEditForm({
  formData,
}: {
  formData: JobPostingResponsePRF;
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    const cleanRichText = (html: string) => {
      const cleaned = DOMPurify.sanitize(html);
      const stripped = cleaned
        .replace(/<p><br\s*\/?><\/p>/gi, "")
        .replace(/<p>\s*<\/p>/gi, "")
        .replace(/^\s*$/, "");
      return stripped || "";
    };

    const data = {
      job_posting: {
        job_title: formData.job_title,
        target_start_date: formData.target_start_date,
        reason_for_posting: formatForJSON(formData.reason_for_posting),
        other_reason_for_posting:
          formData.reason_for_posting !== "Other"
            ? ""
            : formatForJSON(formData.other_reason_for_posting),
        department_name: formatForJSON(formData.department_name),
        employment_type: formData.employment_type,
        work_setup: formatForJSON(formData.work_setup),
        working_site: formData.working_site,
        number_of_vacancies: Number(formData.number_of_vacancies),
        min_salary: Number(formData.min_salary) || 0,
        max_salary: Number(formData.max_salary) || 0,
        description: cleanRichText(formData.description),
        responsibilities: cleanRichText(formData.responsibilities),
        qualifications: cleanRichText(formData.qualifications),
      },
      non_negotiables: cleanRichText(formData.non_negotiables),
      business_unit: formData.business_unit.toLowerCase(),
      immediate_supervisor: formData.immediate_supervisor,
      hiring_managers: formData.hiring_managers.filter(
        (hm: number) => hm !== 0
      ),
      interview_levels: formData.hiring_managers.filter(
        (hm: number) => hm !== 0
      ).length,
      category: formData.category,
      position: formData.position,
      work_schedule_from: formData.work_schedule_from,
      work_schedule_to: formData.work_schedule_to,
      salary_budget: Number(formData.salary_budget),
      is_salary_range: formData.is_salary_range,
      assessment_required: formData.assessment_required,
      other_assessment: Array.isArray(formData.other_assessment)
        ? formData.other_assessment.map((item: string) => formatForJSON(item))
        : (formData.other_assessment as string)
        ? (formData.other_assessment as string)
            .split(",")
            .map((item: string) => formatForJSON(item.trim()))
        : [],
      assessment_types: formData.assessment_types.map(
        (item: { id: number; name: string }) => {
          if (item.id === 0) {
            return { name: formatForJSON(item.name) };
          }
          return { id: item.id, name: formatForJSON(item.name) };
        }
      ),
      hardware_requirements: formData.hardware_requirements.map(
        (item: { id: number; name: string }) => {
          if (item.id === 0) {
            return { name: formatForJSON(item.name) };
          }
          return { id: item.id, name: formatForJSON(item.name) };
        }
      ),
      software_requirements: formData.software_requirements.map(
        (item: { id: number; name: string }) => {
          if (item.id === 0) {
            return { name: formatForJSON(item.name) };
          }
          return { id: item.id, name: formatForJSON(item.name) };
        }
      ),
    };
    try {
      const response = await axiosPrivate.patch(
        `/api/prf/${formData.id}/`,
        data
      );

      if (response.status === 200) {
        toast.success("PRF updated successfully!");
        navigate("/requests");
      }
    } catch (error: AxiosError | any) {
      console.error("Error updating form:", error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        toast.error("Failed to update form. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    loading,
    errors,
  };
}
