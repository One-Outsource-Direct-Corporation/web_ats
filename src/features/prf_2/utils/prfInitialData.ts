import type { User } from "@/features/auth/types/auth.types";
import {
  JobPostingStatus,
  JobPostingType,
} from "@/features/jobs/types/JobPosting";
import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";

export function createInitialPRF2Data(user?: User | null): PRFFormData {
  return {
    job_posting: {
      job_title: "",
      target_start_date: "",
      reason_for_posting: "",
      other_reason_for_posting: "",
      experience_level: "",
      department: "",
      department_display: null,
      employment_type: "",
      work_setup: "",
      working_site: "",
      number_of_vacancies: "",
      work_schedule_from: "",
      work_schedule_to: "",
      min_salary: "",
      max_salary: "",
      description: "",
      responsibilities: "",
      qualifications: "",
      required_skills: [],
      status: JobPostingStatus.PENDING,
      type: JobPostingType.PRF,
    },
    prf_input: {
      business_unit: user?.business_unit?.id || "",
      immediate_supervisor: "",
      immediate_supervisor_display: null,
      category: "",
      hardware_required: {},
      software_required: {},
    },
    application_form_input: {
      application_form: {
        name: "optional",
        birth_date: "optional",
        gender: "optional",
        primary_contact_number: "optional",
        secondary_contact_number: "optional",
        email: "optional",
        linkedin_profile: "optional",
        address: "optional",
        expected_salary: "optional",
        willing_to_work_onsite: "optional",
        photo_2x2: "optional",
        upload_med_cert: "optional",
        preferred_interview_schedule: "optional",
        education_attained: "optional",
        year_graduated: "optional",
        university: "optional",
        course: "optional",
        work_experience: "optional",
        how_did_you_hear_about_us: "optional",
        agreement: "optional",
        signature: "optional",
      },
      non_negotiable: {
        non_negotiable: [],
      },
      questionnaire: {
        name: null,
        template: false,
        sections: [],
      },
    },
    pipeline_input: (() => {
      const PASSED_BODY =
        "Dear {{ candidate_name }},\n\n" +
        "We are pleased to inform you that you have successfully completed the {{ pipeline_step_process_type_label }} for the position of {{ job_title }}. " +
        "We will be in touch with further details regarding the next steps.\n\n" +
        "Best regards,\n" +
        "{{ interviewer_name }}\n" +
        "{{ interviewer_role }}\n" +
        "{{ company_name }}";

      const FAILED_BODY =
        "Dear {{ candidate_name }},\n\n" +
        "Thank you for your participation in the {{ pipeline_step_process_type_label }} for the position of {{ job_title }}. " +
        "After careful consideration, we regret to inform you that you have not been successful on this occasion.\n\n" +
        "We appreciate your interest and wish you all the best in your future endeavors.\n\n" +
        "Best regards,\n" +
        "{{ interviewer_name }}\n" +
        "{{ interviewer_role }}\n" +
        "{{ company_name }}";

      const defaultTemplate = (process_type: string, process_title: string, order: number) => ({
        tempId: `default-${process_type}`,
        process_type,
        process_title,
        description: "",
        order,
        stage: 4,
        interviewer: null,
        passedEmailTemplateId: null,
        failedEmailTemplateId: null,
        notification_templates: [
          { action_type: "send_email", trigger_outcome: "passed", subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}", body: PASSED_BODY },
          { action_type: "send_email", trigger_outcome: "failed", subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}", body: FAILED_BODY },
        ],
        assessments: [],
      });

      return [
        defaultTemplate("for_job_offer", "For Job Offer", 1),
        defaultTemplate("pre_onboarding", "Pre-Onboarding", 2),
        defaultTemplate("onboarding", "Onboarding", 3),
      ];
    })(),
  };
}
