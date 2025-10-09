import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobDetail } from "../hooks/useJobDetail";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DocumentUploadModal } from "@/assets/components/document-upload-modal";
import { useApplicationForm } from "../hooks/useApplicationForm";
import { ApplicationSidebar } from "../components/application/ApplicationSidebar";
import { ApplicationHeader } from "../components/application/ApplicationHeader";
import { ApplicationFooter } from "../components/application/ApplicationFooter";
import { MobileProgressBar } from "../components/application/MobileProgressBar";
import { DataPrivacySection } from "../components/application/DataPrivacySection";
import { PersonalInfoSection } from "../components/application/PersonalInfoSection";
import { ContactInfoSection } from "../components/application/ContactInfoSection";
import { AddressInfoSection } from "../components/application/AddressInfoSection";
import { JobDetailsSection } from "../components/application/JobDetailsSection";
import { EducationSection } from "../components/application/EducationSection";
import { WorkExperienceSection } from "../components/application/WorkExperienceSection";
import { AcknowledgementSection } from "../components/application/AcknowledgementSection";
import { ApplicationCompleteModal } from "../components/application/ApplicationCompleteModal";

export default function CareersApply() {
  const params = useParams();
  const navigate = useNavigate();

  const { jobDetail, loading, error } = useJobDetail(params.jobId);

  const [showUploadModal, setShowUploadModal] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [errorMessage, setErrorMessage] = useState({});

  const {
    formData,
    stage2Data,
    stage3Data,
    stage4Data,
    currentStage,
    acceptTerms,
    setAcceptTerms,
    handlePersonalInfoChange,
    handleJobDetailsChange,
    handleEducationWorkChange,
    handleAcknowledgementChange,
    handleAddWorkExperience,
    handleRemoveWorkExperience,
    handleDocumentsUploaded,
    goToNextStage,
    goToPreviousStage,
    saveFormState,
    clearFormState,
  } = useApplicationForm(jobDetail?.job_title);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (showUploadModal || showCompletionModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showUploadModal, showCompletionModal]);

  useEffect(() => {
    document.title = jobDetail
      ? `Apply - ${jobDetail.job_title}`
      : "Careers Apply";
  }, [jobDetail?.job_title]);

  const handleDocumentModalClose = () => {
    setShowUploadModal(false);
  };

  const handleDocumentsUploadComplete = (resumeData: any) => {
    handleDocumentsUploaded(resumeData);
    setShowUploadModal(false);
  };

  const handleNext = () => {
    // Validate current stage before proceeding
    if (!validateCurrentStage()) {
      return;
    }

    if (currentStage < 4) {
      goToNextStage();
    } else {
      // Generate tracking code and submit
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setTrackingCode(code);
      setShowCompletionModal(true);
      clearFormState();
    }
  };

  const validateCurrentStage = () => {
    const applicationForm = jobDetail?.application_form;
    const errors: any = {};

    switch (currentStage) {
      case 1:
        // Check data privacy acceptance
        if (!acceptTerms) {
          errors.acceptTerms =
            "Please accept the data privacy terms to continue.";
        }

        // Validate personal information
        if (applicationForm?.name === "required") {
          if (!formData.firstName.trim() || !formData.lastName.trim()) {
            errors.name = "Please fill in your first and last name.";
          }
        }

        if (applicationForm?.birth_date === "required") {
          if (!formData.birthday) {
            errors.birthday = "Please select your birthday.";
          }
        }

        if (applicationForm?.gender === "required") {
          if (!formData.gender) {
            errors.gender = "Please select your gender.";
          }
        }

        // Validate contact information
        if (applicationForm?.primary_contact_number === "required") {
          if (!formData.primaryContact.trim()) {
            errors.primaryContact =
              "Please provide your primary contact number.";
          }
        }

        if (applicationForm?.email === "required") {
          if (!formData.email.trim()) {
            errors.email = "Please provide your email address.";
          }
        }

        // Validate address if enabled
        if (applicationForm?.address !== "disabled") {
          if (applicationForm?.address === "required") {
            if (
              !formData.addressLine1.trim() ||
              !formData.city.trim() ||
              !formData.district.trim() ||
              !formData.postalCode.trim() ||
              !formData.country.trim()
            ) {
              errors.address = "Please fill in all address fields.";
            }
          }
        }
        break;

      case 2:
        // Validate job details
        if (!stage2Data.positionApplyingFor.trim()) {
          errors.positionApplyingFor =
            "Please specify the position you're applying for.";
        }

        // Check if photo is required
        if (applicationForm?.photo_2x2 === "required") {
          if (!stage2Data.photo) {
            errors.photo = "Please upload your 2x2 photo.";
          }
        }

        // Check if medical certificate is required
        if (applicationForm?.upload_med_cert === "required") {
          if (!stage2Data.medicalCertificate) {
            errors.medicalCertificate =
              "Please upload your medical certificate.";
          }
        }

        // Check if expected salary is required
        if (applicationForm?.expected_salary === "required") {
          if (!stage2Data.expectedSalary.trim()) {
            errors.expectedSalary = "Please specify your expected salary.";
          }
        }

        // Check if willing to work onsite is required
        if (applicationForm?.willing_to_work_onsite === "required") {
          if (!stage2Data.willingToWorkOnsite) {
            errors.willingToWorkOnsite =
              "Please specify if you're willing to work onsite.";
          }
        }

        // Check if preferred interview schedule is required
        if (applicationForm?.preferred_interview_schedule === "required") {
          if (!stage2Data.interviewSchedule.trim()) {
            errors.interviewSchedule =
              "Please specify your preferred interview schedule.";
          }
        }
        break;

      case 3:
        // Validate education
        if (applicationForm?.education_attained === "required") {
          if (!stage3Data.highestEducation) {
            errors.highestEducation =
              "Please specify your highest education attained.";
          }
        }

        if (applicationForm?.year_graduated === "required") {
          if (!stage3Data.yearGraduated) {
            errors.yearGraduated = "Please specify your year of graduation.";
          }
        }

        if (applicationForm?.university === "required") {
          if (!stage3Data.institution) {
            errors.institution = "Please specify your educational institution.";
          }
        }

        if (applicationForm?.course === "required") {
          if (!stage3Data.program) {
            errors.program = "Please specify your course/program.";
          }
        }

        // Validate work experience if enabled
        if (
          applicationForm?.work_experience &&
          applicationForm?.work_experience !== "disabled"
        ) {
          if (applicationForm?.work_experience === "required") {
            if (
              stage3Data.hasWorkExperience === "yes" &&
              stage3Data.workExperience.length === 0
            ) {
              errors.workExperience =
                "Please add at least one work experience entry.";
            }
          }
        }
        break;

      case 4:
        // Check certification acceptance
        if (!stage4Data.certificationAccepted) {
          errors.certificationAccepted =
            "Please accept the certification and acknowledgement.";
        }

        // Validate signature
        if (!stage4Data.signature) {
          errors.signature =
            "Please provide your signature (either by typing or uploading).";
        }
        break;
    }

    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBack = () => {
    goToPreviousStage();
  };

  const handleBackToHome = () => {
    navigate("/careers");
  };

  const handleTrackApplication = () => {
    navigate("/careers/track");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleBackToJobDescription = useCallback(() => {
    if (jobDetail) {
      saveFormState();
      navigate(`/careers/${jobDetail.id}`);
    }
  }, [jobDetail, saveFormState, navigate]);

  console.log(jobDetail);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-700">{error}</p>
          <Button
            variant="outline"
            className="mt-6 bg-transparent"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!jobDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Failed to load job details</p>
          <button onClick={handleBackToHome} className="text-blue-600 mt-4">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex flex-col lg:flex-row min-h-screen">
      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-900/65 flex items-center justify-center z-50 p-4">
          <div className="max-h-[90vh] overflow-y-auto">
            <DocumentUploadModal
              onClose={handleDocumentModalClose}
              onDocumentsUploaded={handleDocumentsUploadComplete}
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation Bar */}
      <MobileProgressBar
        currentStage={currentStage}
        jobTitle={jobDetail.job_title || ""}
        onLogoClick={handleLogoClick}
      />

      {/* Desktop Sidebar */}
      <ApplicationSidebar
        currentStage={currentStage}
        onLogoClick={handleLogoClick}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto h-screen pb-20">
        {/* Desktop Header */}
        <ApplicationHeader
          job={jobDetail}
          onViewJobDescription={handleBackToJobDescription}
        />

        {/* Form Content */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Stage 1 - Applicant Information */}
          {currentStage === 1 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <DataPrivacySection
                acceptTerms={acceptTerms}
                onAcceptTermsChange={setAcceptTerms}
              />
              <PersonalInfoSection
                formData={formData}
                onInputChange={handlePersonalInfoChange}
                applicationForm={jobDetail?.application_form}
                errors={errorMessage}
              />
              <ContactInfoSection
                formData={formData}
                onInputChange={handlePersonalInfoChange}
                applicationForm={jobDetail?.application_form}
                errors={errorMessage}
              />
              {jobDetail?.application_form?.address !== "disabled" && (
                <AddressInfoSection
                  formData={formData}
                  onInputChange={handlePersonalInfoChange}
                  errors={errorMessage}
                />
              )}
            </div>
          )}

          {/* Stage 2 - Job Details */}
          {currentStage === 2 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <JobDetailsSection
                data={stage2Data}
                onChange={handleJobDetailsChange}
                applicationForm={jobDetail?.application_form}
                errors={errorMessage}
              />
            </div>
          )}

          {/* Stage 3 - Work and Education */}
          {currentStage === 3 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <EducationSection
                data={stage3Data}
                onChange={handleEducationWorkChange}
                applicationForm={jobDetail?.application_form}
                errors={errorMessage}
              />
              {jobDetail?.application_form?.work_experience && (
                <WorkExperienceSection
                  data={stage3Data}
                  onChange={handleEducationWorkChange}
                  onAddExperience={handleAddWorkExperience}
                  onRemoveExperience={handleRemoveWorkExperience}
                  errors={errorMessage}
                />
              )}
            </div>
          )}

          {/* Stage 4 - Acknowledgement */}
          {currentStage === 4 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <AcknowledgementSection
                data={stage4Data}
                onChange={handleAcknowledgementChange}
                applicationForm={jobDetail?.application_form}
                errors={errorMessage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer for Navigation Buttons */}
      <ApplicationFooter
        currentStage={currentStage}
        acceptTerms={acceptTerms}
        certificationAccepted={stage4Data.certificationAccepted}
        onBack={handleBack}
        onNext={handleNext}
      />

      {/* Application Complete Modal */}
      {showCompletionModal && (
        <ApplicationCompleteModal
          trackingCode={trackingCode}
          onBackToHome={handleBackToHome}
          onTrackApplication={handleTrackApplication}
        />
      )}
    </div>
  );
}
