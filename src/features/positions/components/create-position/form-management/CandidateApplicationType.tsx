import React from "react";

interface CandidateApplicationTypeProps {
  defaultValue?: "external" | "internal";
  onChange?: (value: "external" | "internal") => void;
}

export const CandidateApplicationType: React.FC<
  CandidateApplicationTypeProps
> = ({ defaultValue = "external", onChange }) => {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
        Candidate Applications
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Choose how candidates can apply to this position.
      </p>

      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="candidateApplication"
            value="external"
            defaultChecked={defaultValue === "external"}
            onChange={() => onChange?.("external")}
            className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
          />
          <span className="text-sm text-blue-600">
            External Job Posting Platforms (LinkedIn, Jobstreet, etc.)
          </span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="candidateApplication"
            value="internal"
            defaultChecked={defaultValue === "internal"}
            onChange={() => onChange?.("internal")}
            className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
          />
          <span className="text-sm text-gray-700">Internal Only</span>
        </label>
      </div>
    </div>
  );
};
