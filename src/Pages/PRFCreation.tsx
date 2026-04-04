import CancelRequestModal from "@/features/prf_2/components/CancelRequestModal";
import PRFStepsNavigation from "@/features/prf_2/components/PRFStepsNavigation";
import { useState } from "react";
import PRFStepComponent from "@/features/prf_2/components/PRFStepComponent.tsx";
import PRFNavigationButton from "@/features/prf_2/components/PRFNavigationButton.tsx";
import { usePRF2Form } from "@/features/prf_2/hooks/usePRF2Form";
import { usePRF2Mutation } from "@/features/prf_2/hooks/usePRF2Mutation";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PRFSidebarPreview from "@/features/prf_2/components/PRFSidebarPreview.tsx";

export default function PRFCreation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { formData, setFormData, serializeFormData } = usePRF2Form();
  const { submitPrf, isSubmitting } = usePRF2Mutation();

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    try {
      const response = await submitPrf(serializeFormData());

      if (response.status === 200 || response.status === 201) {
        toast.success("PRF submitted successfully!");
        navigate("/requests");
        return;
      }

      toast.error("Failed to submit PRF. Please try again.");
    } catch (error: unknown) {
      const errorMessage =
        isAxiosError<{ detail?: string; error?: string }>(error) &&
        (error.response?.data?.detail || error.response?.data?.error)
          ? error.response.data.detail || error.response.data.error
          : "Failed to submit PRF. Please try again.";

      toast.error(errorMessage);
    }
  }

  function handleStepNextChange() {
    if (step === 6) {
      void handleSubmit();
      return;
    }

    setStep((prev) => prev + 1);
  }

  function handleStepPrevChange() {
    if (step === 1) return;

    setStep((prev) => prev - 1);
  }

  return (
    <section className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <h1 className="text-lg font-bold text-gray-800 mb-6">
          Personnel Requisition Form
        </h1>

        <CancelRequestModal />

        <PRFStepsNavigation step={step} setStep={setStep} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <PRFStepComponent
              step={step}
              formData={formData}
              updateFormData={setFormData}
          />


          {(step > 0 && step < 4) && <PRFSidebarPreview step={step} formData={formData} />}
        </div>
        <PRFNavigationButton
          step={step}
          handleNext={handleStepNextChange}
          handlePrevious={handleStepPrevChange}
          submitting={isSubmitting}
        />
      </div>
    </section>
  );
}
