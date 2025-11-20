import { useRef } from "react";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { AcknowledgementFormData } from "../../types/application_form.types";
import { Upload } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/shared/components/ui/field";
import type { ApplicationFormBase } from "@/shared/types/application_form.types";

interface AcknowledgementSectionProps {
  formData: AcknowledgementFormData;
  onInputChange: (
    field: keyof AcknowledgementFormData,
    value: string | boolean | File | null
  ) => void;
  applicationForm: ApplicationFormBase;
}

export function AcknowledgementSection({
  formData,
  onInputChange,
  applicationForm,
}: AcknowledgementSectionProps) {
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const handleClearSignature = () => {
    sigCanvasRef.current?.clear();
    onInputChange("signature", "");
  };

  const handleSaveSignature = () => {
    const dataURL = sigCanvasRef.current?.toDataURL("image/png");
    if (dataURL) {
      fetch(dataURL)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "signature.png", { type: "image/png" });
          onInputChange("signature", file);
        });
    }
  };

  return (
    <div>
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="howDidYouLearn">
            How did you hear about us?
          </FieldLabel>
          <Select
            value={formData.howDidYouLearn ?? ""}
            onValueChange={(value) => onInputChange("howDidYouLearn", value)}
            disabled={applicationForm.how_did_you_hear_about_us === "disabled"}
            required={applicationForm.how_did_you_hear_about_us === "required"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="job-board">Job Board</SelectItem>
              <SelectItem value="social-media">Social Media</SelectItem>
              <SelectItem value="company-website">Company Website</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            id="certification"
            checked={formData.certificationAccepted ?? false}
            onCheckedChange={(checked) =>
              onInputChange("certificationAccepted", checked === true)
            }
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
            disabled={applicationForm.agreement === "disabled"}
            required={applicationForm.agreement === "required"}
          />
          <FieldLabel
            htmlFor="certification"
            className="text-sm text-gray-700 leading-relaxed cursor-pointer"
          >
            I hereby certify that all information provided in this application
            is true, complete, and accurate to the best of my knowledge. I
            understand that any false information or omission may disqualify me
            from employment consideration or result in dismissal if discovered
            at a later date.
          </FieldLabel>
        </Field>

        <FieldSet>
          <FieldDescription className="text-sm font-medium text-gray-700">
            Signature
          </FieldDescription>

          <Field className="flex flex-col md:flex-row gap-4">
            {/* Signature Pad */}
            <Field className="flex-1">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <SignatureCanvas
                  penColor="black"
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: "w-full h-[200px] bg-white",
                  }}
                  ref={sigCanvasRef}
                />
              </div>
              <div className="mt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleClearSignature}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear
                </button>
                {/* <button
                  type="button"
                  onClick={handleSaveSignature}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Save Signature
                </button> */}
              </div>
              {typeof formData.signature !== "string" && formData.signature && (
                <p className="text-sm text-green-600 mt-2">✓ Signature saved</p>
              )}
            </Field>

            {/* Upload Signature */}
            <Field className="flex-1 space-y-2">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-[200px] flex items-center justify-center bg-white hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    onInputChange("signature", e.target.files?.[0] || null)
                  }
                  className="hidden"
                  id="signature-upload"
                  disabled={applicationForm.signature === "disabled"}
                  required={applicationForm.signature === "required"}
                />
                <label htmlFor="signature-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-600 block">
                    {typeof formData.signature !== "string" &&
                    formData.signature
                      ? formData.signature.name
                      : "Upload signature"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1 block">
                    PNG, JPG up to 5MB
                  </span>
                </label>
              </div>
            </Field>
          </Field>
        </FieldSet>
      </FieldSet>
    </div>
  );
}
