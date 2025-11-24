import { Button } from "@/shared/components/ui/button";
import type { PRFDb, PRFFormData } from "../../types/prf.types";
import { ArrowLeft } from "lucide-react";
import { PreviewInfo } from "../PreviewInfo";
import PRFSummary from "../PRFSummary";
import Approver from "../Approver";

interface Step06Props {
  goToPreviousStep: () => void;
  formData: PRFFormData;
  step: number;
  handleSubmit: () => void;
  updateMode?: boolean;
}

export const Step06 = ({
  goToPreviousStep,
  formData,
  step,
  handleSubmit,
  updateMode,
}: Step06Props) => {
  return (
    <div className="gap-8 mt-6 text-gray-800 space-y-6">
      <div className="lg:col-span-2 space-y-10">
        <h2 className="text-blue-700 font-bold text-lg mb-4 border-l-4 border-blue-700 pl-2 uppercase">
          Review Your Request
        </h2>
        <PRFSummary formData={formData} />
        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={goToPreviousStep}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            className="bg-[#0056D2] hover:bg-blue-700 text-white"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
      {!updateMode ? (
        <PreviewInfo step={step} formData={formData} />
      ) : (
        <Approver
          formData={formData}
          approvers={(formData as PRFDb).job_posting.approver}
        />
      )}
    </div>
  );
};
