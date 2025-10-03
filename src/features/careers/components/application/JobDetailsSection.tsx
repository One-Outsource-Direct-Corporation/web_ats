import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import type { JobDetailsFormData } from "../../types/applicationForm";
import { Upload } from "lucide-react";

interface JobDetailsSectionProps {
  data: JobDetailsFormData;
  onChange: (field: string, value: string | File | null) => void;
}

export const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>

      <div className="space-y-6">
        {/* Position Applying For */}
        <div className="space-y-2">
          <Label htmlFor="positionApplyingFor">Position Applying For</Label>
          <Input
            id="positionApplyingFor"
            value={data.positionApplyingFor}
            onChange={(e) => onChange("positionApplyingFor", e.target.value)}
            placeholder="Enter position"
          />
        </div>

        {/* Expected Salary */}
        <div className="space-y-2">
          <Label htmlFor="expectedSalary">Expected Salary</Label>
          <Input
            id="expectedSalary"
            value={data.expectedSalary}
            onChange={(e) => onChange("expectedSalary", e.target.value)}
            placeholder="Enter expected salary"
          />
        </div>

        {/* Willing to Work Onsite */}
        <div className="space-y-2">
          <Label>Willing to Work Onsite?</Label>
          <RadioGroup
            value={data.willingToWorkOnsite}
            onValueChange={(value) => onChange("willingToWorkOnsite", value)}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="onsite-yes" />
              <Label
                htmlFor="onsite-yes"
                className="cursor-pointer font-normal"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="onsite-no" />
              <Label htmlFor="onsite-no" className="cursor-pointer font-normal">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Upload Recent 2x2 Photo
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onChange("photo", e.target.files?.[0] || null)}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-600">
                {data.photo ? data.photo.name : "Click to upload photo"}
              </span>
            </label>
          </div>
        </div>

        {/* Medical Certificate */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Upload Medical Certificate (Optional)
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                onChange("medicalCertificate", e.target.files?.[0] || null)
              }
              className="hidden"
              id="medical-upload"
            />
            <label htmlFor="medical-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-600">
                {data.medicalCertificate
                  ? data.medicalCertificate.name
                  : "Click to upload certificate"}
              </span>
            </label>
          </div>
        </div>

        {/* Interview Schedule */}
        <div className="space-y-2">
          <Label htmlFor="interviewSchedule">
            Preferred Interview Schedule
          </Label>
          <Input
            id="interviewSchedule"
            type="datetime-local"
            value={data.interviewSchedule}
            onChange={(e) => onChange("interviewSchedule", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
