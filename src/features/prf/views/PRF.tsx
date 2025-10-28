import { useNavigate } from "react-router-dom";
import { usePRFForm } from "../hooks/usePRFForm";
import { Step01 } from "../components/Step01";
import { Step02 } from "../components/Step02";
import { Step03 } from "../components/Step03";
import { Step04 } from "../components/Step04";
import {
  CancelConfirmModal,
  SubmitConfirmModal,
  SuccessPopup,
} from "../components/PRFModal";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatForJSON } from "@/shared/utils/formatName";
import initialData from "../data/prfInitialData";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type { FormDataType } from "../types/prf.types";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

document.title = "Personnel Requisition Form";

export default function PRF() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [maxStepVisited, setMaxStepVisited] = useState(1);
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  const [showSubmitConfirmDialog, setShowSubmitConfirmDialog] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { user } = useAuth();
  const { formData, updateFormData } = usePRFForm(initialData(user));
  const axiosPrivate = useAxiosPrivate();

  const goToNextStep = () => {
    setStep((prev) => {
      const nextStep = Math.min(prev + 1, 4);
      setMaxStepVisited((currentMax) => Math.max(currentMax, nextStep));
      return nextStep;
    });
  };

  const goToPreviousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleCancelRequest = () => {
    setShowCancelConfirmDialog(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirmDialog(false);
    navigate("/requests");
  };

  const handleSaveAsDraft = () => {
    setShowCancelConfirmDialog(false);
    navigate("/requests");
  };

  const handleSubmit = () => {
    setShowSubmitConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowSubmitConfirmDialog(false);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      // navigate("/requests");
    }, 1500);

    const data = {
      job_posting: {
        job_title: formData.job_title,
        target_start_date: formData.target_start_date,
        reason_for_posting: formatForJSON(formData.reason_for_posting),
        other_reason_for_posting:
          formData.reason_for_posting !== "Other"
            ? ""
            : formatForJSON(formData.reason_for_posting),
        department_name: formatForJSON(formData.department),
        employment_type: formData.employment_type,
        work_setup: formatForJSON(formData.work_setup),
        working_site: formData.working_site,
        min_salary: Number(formData.min_salary) || 0,
        max_salary: Number(formData.max_salary) || 0,
        description: formData.description,
        responsibilities: formData.responsibilities,
        qualifications: formData.qualifications,
      },
      non_negotiables: formData.non_negotiables,
      number_of_vacancies: Number(formData.number_of_vacancies),
      business_unit: formData.business_unit.toLowerCase(),
      interview_levels: Number(formData.interview_levels),
      immediate_supervisor: formData.immediate_supervisor,
      hiring_managers:
        formData.interview_levels < 0 ||
        formData.hiring_managers.some(
          (hm: string) => hm === "no-hiring-manager"
        )
          ? []
          : formData.hiring_managers,
      category: formData.category,
      position: formData.position,
      work_schedule_from: formData.work_schedule_from,
      work_schedule_to: formData.work_schedule_to,
      salary_budget: Number(formData.salary_budget),
      is_salary_range: formData.is_salary_range,
      assessment_required: formData.assessment_required,
      other_assessment: formData.other_assessment
        ? formData.other_assessment
            .split(",")
            .map((item: string) => formatForJSON(item))
        : [],
      assessment_types: Object.keys(formData.assessment_types).filter(
        (key) =>
          formData.assessment_types[
            key as keyof typeof formData.assessment_types
          ]
      ),
      hardware_requirements: Object.keys(formData.hardware_required).filter(
        (key) =>
          formData.hardware_required[
            key as keyof typeof formData.hardware_required
          ]
      ),
      software_requirements: Object.keys(formData.software_required).filter(
        (key) =>
          formData.software_required[
            key as keyof typeof formData.software_required
          ]
      ),
    };

    try {
      const response = await axiosPrivate.post<AxiosResponse<FormDataType>>(
        "/api/prf/",
        data
      );

      if (response.status === 201) {
        toast.success("PRF submitted successfully!");
      }
    } catch (err: AxiosError | any) {
      toast.error("Failed to submit PRF. Please try again.");
      console.error("Error submitting PRF:", err);
    }
  };

  return (
    <>
      <SuccessPopup show={showSuccessPopup} />
      <div className="min-h-screen bg-white p-6 pt-[100px]">
        <div className="mx-auto max-w-7xl space-y-4">
          <h1 className="text-lg font-bold text-gray-800 mb-6">
            Personnel Requisition Form
          </h1>
          <div className="flex justify-between items-center mb-4">
            <a
              href="#"
              className="text-[#0056D2] text-sm hover:underline"
              onClick={handleCancelRequest}
            >
              &larr; Cancel Request
            </a>
          </div>
          <div className="flex space-x-0 border border-gray-300 rounded-md overflow-hidden mb-8">
            {["Step 01", "Step 02", "Step 03", "Step 04"].map((label, i) => (
              <div
                key={i}
                className={`flex-1 text-center py-2 text-sm font-semibold relative ${
                  i + 1 === step
                    ? "bg-[#0056D2] text-white"
                    : "bg-white text-gray-500"
                } ${
                  i + 1 <= maxStepVisited && i + 1 !== step
                    ? "cursor-pointer hover:bg-gray-100"
                    : ""
                }`}
                onClick={() => {
                  if (i + 1 <= maxStepVisited && i + 1 !== step) {
                    setStep(i + 1);
                  }
                }}
              >
                {label}
                {i < 3 && (
                  <span className="absolute right-0 top-0 h-full w-px bg-gray-300" />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <Step01
              goToNextStep={goToNextStep}
              step={step}
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {step === 2 && (
            <Step02
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              step={step}
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {step === 3 && (
            <Step03
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              step={step}
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {step === 4 && (
            <Step04
              goToPreviousStep={goToPreviousStep}
              step={step}
              formData={formData}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <CancelConfirmModal
        open={showCancelConfirmDialog}
        onClose={() => setShowCancelConfirmDialog(false)}
        onConfirmCancel={handleConfirmCancel}
        onSaveAsDraft={handleSaveAsDraft}
      />

      {/* Submit Confirmation Dialog */}
      <SubmitConfirmModal
        open={showSubmitConfirmDialog}
        onClose={() => setShowSubmitConfirmDialog(false)}
        onConfirmSubmit={handleConfirmSubmit}
      />
    </>
  );
}
