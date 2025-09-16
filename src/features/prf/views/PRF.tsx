"use client";

import { useEffect, useState } from "react";
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

export default function PRF() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [maxStepVisited, setMaxStepVisited] = useState(1);
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  const [showSubmitConfirmDialog, setShowSubmitConfirmDialog] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const initialFormData = {
    jobTitle: "",
    targetStartDate: "",
    numberOfVacancies: "",
    reasonForPosting: "",
    otherReasonForPosting: "",
    businessUnit: "",
    departmentName: "",
    interviewLevels: 4,
    immediateSupervisor: "",
    hiringManagers: [],
    contractType: "",
    workArrangement: "",
    category: "",
    position: "",
    workingSite: "",
    workScheduleFrom: "",
    workScheduleTo: "",
    jobDescription: "",
    responsibilities: "",
    qualifications: "",
    nonNegotiables: "",
    salaryBudget: "",
    isSalaryRange: false,
    minSalary: "",
    maxSalary: "",
    assessmentRequired: "Yes",
    assessmentTypes: {
      technical: true,
      language: true,
      cognitive: false,
      personality: true,
      behavioral: false,
      cultural: false,
    },
    otherAssessment: "Psychological Test",
    hardwareRequired: {
      desktop: false,
      handset: false,
      headset: true,
      laptop: true,
    },
    softwareRequired: {
      "Adobe Photoshop": true,
      "Google Chrome": false,
      "MS Teams": false,
      "Open VPN": false,
      WinRAR: false,
      ZOHO: false,
      Email: false,
      "Microsoft Office": true,
      "Nitro Pro 8 PDF": false,
      Viber: true,
      Xlite: false,
      Zoom: false,
    },
  };
  const { formData, updateFormData } = usePRFForm(initialFormData);
  console.log(formData);

  useEffect(() => {
    document.title = "Personnel Requisition Form";
  }, []);

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

  const handleConfirmSubmit = () => {
    setShowSubmitConfirmDialog(false);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate("/requests");
    }, 1500);
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
