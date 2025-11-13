import { Button } from "@/shared/components/ui/button";
import type { PRFFormData } from "../../types/prf.types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ApplicationFormManagement } from "@/shared/components/reusables/ApplicationFormManagement";
import type { ApplicationFormQuestionnaire } from "@/features/positions-client/types/questionnaire.types";
import type {
  ApplicationForm,
  ApplicationFormType,
  NonNegotiable,
} from "@/shared/types/application_form.types";

interface Step04Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  formData: PRFFormData;
  applicationFormHandler: (
    field: keyof ApplicationForm,
    value: ApplicationFormType
  ) => void;
  nonNegotiableHandler: (updatedNonNegotiables: NonNegotiable) => void;
  questionnaireHandler: (
    updatedQuestionnaire: ApplicationFormQuestionnaire
  ) => void;
}

export const Step04 = ({
  goToNextStep,
  goToPreviousStep,
  formData,
  applicationFormHandler,
  nonNegotiableHandler,
  questionnaireHandler,
}: Step04Props) => {
  return (
    <div className="space-y-10">
      <ApplicationFormManagement
        applicationFormData={formData.application_form}
        applicationFormHandler={applicationFormHandler}
        nonNegotiableHandler={nonNegotiableHandler}
        questionnaireHandler={questionnaireHandler}
      />
      <div className="flex justify-between mt-10">
        <Button variant="outline" onClick={goToPreviousStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          className="bg-[#0056D2] hover:bg-blue-700 text-white"
          onClick={goToNextStep}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
