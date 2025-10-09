import React from "react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { FormData } from "../types/prfTypes";

interface PRFFormProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const PRFForm: React.FC<PRFFormProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Title
        </label>
        <Input
          value={formData.jobTitle}
          onChange={(e) => updateFormData({ jobTitle: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Start Date
        </label>
        <Input
          type="date"
          value={formData.targetStartDate}
          onChange={(e) => updateFormData({ targetStartDate: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Vacancies
        </label>
        <Input
          value={formData.numberOfVacancies}
          onChange={(e) =>
            updateFormData({ numberOfVacancies: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Description
        </label>
        <Textarea
          value={formData.jobDescription}
          onChange={(e) => updateFormData({ jobDescription: e.target.value })}
        />
      </div>
      {/* ...add more fields as needed... */}
    </form>
  );
};
