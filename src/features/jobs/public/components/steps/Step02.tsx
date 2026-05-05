import { JobDetailsSection } from "../application/JobDetailsSection";
import type { JobDetailsFormData } from "../../types/application_form.types";
import type { ApplicationFormBase } from "@/shared/types/application_form.types";
import type { CandidateDetailsFile } from "@/features/candidate/services/candidateProfile.service";

interface Step02Props {
  formData: JobDetailsFormData;
  onInputChange: (field: string, value: string | string[] | File | number | null) => void;
  applicationForm: ApplicationFormBase;
  profilePhoto?: CandidateDetailsFile | null;
  profileMedicalCertificate?: CandidateDetailsFile | null;
}

export default function Step02({
  formData,
  onInputChange,
  applicationForm,
  profilePhoto,
  profileMedicalCertificate,
}: Step02Props) {
  return (
    <JobDetailsSection
      formData={formData}
      onInputChange={onInputChange}
      applicationForm={applicationForm}
      profilePhoto={profilePhoto}
      profileMedicalCertificate={profileMedicalCertificate}
    />
  );
}
