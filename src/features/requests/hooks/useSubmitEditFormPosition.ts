import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type { JobPostingResponsePosition } from "@/features/jobs/types/jobTypes";
import { formatForJSON } from "@/shared/utils/formatName";
import type { AxiosError } from "axios";
import DOMPurify from "dompurify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function useSubmitEditFormPosition({
  formData,
}: {
  formData: JobPostingResponsePosition;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanRichText = (html: string) => {
        const cleaned = DOMPurify.sanitize(html);
        const stripped = cleaned
          .replace(/<p><br\s*\/?><\/p>/gi, "")
          .replace(/<p>\s*<\/p>/gi, "")
          .replace(/^\s*$/, "");
        return stripped || "";
      };

      const data = {
        client: formData.client,
        education_level: formData.education_level,
        experience_level: formData.experience_level,
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
        application_form: { ...formData.application_form },
        pipeline: [...formData.pipeline],
      };

      const response = await axiosPrivate.patch(
        `/api/position/${formData.id}/`,
        data
      );

      if (response.status === 200) {
        toast.success("Position updated successfully");
        navigate(`/requests`);
      }
    } catch (err: AxiosError | any) {
      console.log(formData);
      console.log(err.response.data);
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        toast.error("Failed to update form. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, error };
}
