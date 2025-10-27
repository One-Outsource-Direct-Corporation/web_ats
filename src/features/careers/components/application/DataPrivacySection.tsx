import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";

interface DataPrivacySectionProps {
  acceptTerms: boolean;
  onAcceptTermsChange: (accepted: boolean) => void;
}

export const DataPrivacySection = ({
  acceptTerms,
  onAcceptTermsChange,
}: DataPrivacySectionProps) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-900">Data Privacy</h2>
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">
        I agree to provide my personal information regarding my application. I
        understand that it will only be used for this purpose. For more
        information, you may visit{" "}
        <a
          href="[https://oodc.com.ph/privacy-policy/](https://oodc.com.ph/privacy-policy/)"
          className="text-blue-600 hover:underline"
        >
          [https://oodc.com.ph/privacy-policy/](https://oodc.com.ph/privacy-policy/)
        </a>
        .
      </p>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => onAcceptTermsChange(checked as boolean)}
        />
        <Label
          htmlFor="terms"
          className="text-sm text-gray-700 flex items-center"
        >
          I accept the terms and conditions
          <span className="text-red-500 ml-1">*</span>
        </Label>
      </div>
    </div>
  );
};
