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
import type { AcknowledgementFormData } from "../../types/applicationForm";
import { Upload } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

interface AcknowledgementSectionProps {
  data: AcknowledgementFormData;
  onChange: (field: string, value: string | boolean | File | null) => void;
}

export const AcknowledgementSection: React.FC<AcknowledgementSectionProps> = ({
  data,
  onChange,
}) => {
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const handleClearSignature = () => {
    sigCanvasRef.current?.clear();
    onChange("signature", "");
  };

  const handleSaveSignature = () => {
    const dataURL = sigCanvasRef.current?.toDataURL("image/png");
    if (dataURL) {
      // Convert dataURL to File object
      fetch(dataURL)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "signature.png", { type: "image/png" });
          onChange("signature", file);
        });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-6">
        {/* How Did You Learn */}
        <div className="space-y-2">
          <Label htmlFor="howDidYouLearn">How did you hear about us?</Label>
          <Select
            value={data.howDidYouLearn}
            onValueChange={(value) => onChange("howDidYouLearn", value)}
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
        </div>

        {/* Certification */}
        <div className="flex items-start space-x-2 space-y-2">
          <Checkbox
            id="certification"
            checked={data.certificationAccepted}
            onCheckedChange={(checked) =>
              onChange("certificationAccepted", checked === true)
            }
          />
          <label
            htmlFor="certification"
            className="text-sm text-gray-700 leading-relaxed cursor-pointer"
          >
            I hereby certify that all information provided in this application
            is true, complete, and accurate to the best of my knowledge. I
            understand that any false information or omission may disqualify me
            from employment consideration or result in dismissal if discovered
            at a later date.
          </label>
        </div>

        {/* Signature */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Signature
          </Label>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Signature Pad */}
            <div className="flex-1">
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
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleSaveSignature}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Save Signature
                </button>
              </div>
              {typeof data.signature !== "string" && data.signature && (
                <p className="text-sm text-green-600 mt-2">✓ Signature saved</p>
              )}
            </div>

            {/* Upload Signature */}
            <div className="flex-1 space-y-2">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-[200px] flex items-center justify-center bg-white hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    onChange("signature", e.target.files?.[0] || null)
                  }
                  className="hidden"
                  id="signature-upload"
                />
                <label htmlFor="signature-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-600 block">
                    {typeof data.signature !== "string" && data.signature
                      ? data.signature.name
                      : "Upload signature"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1 block">
                    PNG, JPG up to 5MB
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
