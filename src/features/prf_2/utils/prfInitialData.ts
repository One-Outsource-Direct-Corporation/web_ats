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
      status: JobPostingStatus.PENDING,
      type: JobPostingType.PRF,
    },
    prf_input: {
      business_unit: user?.business_unit || "",
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
    pipeline_input: [],
  };
}
