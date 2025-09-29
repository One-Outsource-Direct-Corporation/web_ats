import React from "react";
import type { CreatePositionFormData } from "../../../types/createPosition";

interface BasicDetailsFormProps {
  formData: CreatePositionFormData;
  onInputChange: (field: string, value: string) => void;
}

export const BasicDetailsForm: React.FC<BasicDetailsFormProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div>
      {/* Basic Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => onInputChange("jobTitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter job title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              value={formData.department}
              onChange={(e) => onInputChange("department", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">Human Resources</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Type *
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) => onInputChange("employmentType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Setup *
            </label>
            <select
              value={formData.workSetup}
              onChange={(e) => onInputChange("workSetup", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education Needed *
            </label>
            <select
              value={formData.educationNeeded}
              onChange={(e) => onInputChange("educationNeeded", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="High School">High School</option>
              <option value="Associate's Degree">Associate's Degree</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level *
            </label>
            <select
              value={formData.experience}
              onChange={(e) => onInputChange("experience", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headcounts Needed *
            </label>
            <input
              type="number"
              value={formData.headcountsNeeded}
              onChange={(e) =>
                onInputChange("headcountsNeeded", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of positions"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Needed *
            </label>
            <input
              type="date"
              value={formData.dateNeeded}
              onChange={(e) => onInputChange("dateNeeded", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Hire *
            </label>
            <select
              value={formData.reasonForHire}
              onChange={(e) => onInputChange("reasonForHire", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="New Position">New Position</option>
              <option value="Replacement">Replacement</option>
              <option value="Expansion">Expansion</option>
              <option value="Temporary Coverage">Temporary Coverage</option>
              <option value="Project-Based">Project-Based</option>
              <option value="Others, Please Specify">
                Others, Please Specify
              </option>
            </select>
          </div>

          {formData.reasonForHire === "Others, Please Specify" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please Specify *
              </label>
              <input
                type="text"
                value={formData.reasonSpecify}
                onChange={(e) => onInputChange("reasonSpecify", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please specify the reason for hire"
              />
            </div>
          )}
        </div>
      </div>

      {/* Budget Range */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Budget Range
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget From *
            </label>
            <input
              type="number"
              value={formData.budgetFrom}
              onChange={(e) => onInputChange("budgetFrom", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimum salary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget To *
            </label>
            <input
              type="number"
              value={formData.budgetTo}
              onChange={(e) => onInputChange("budgetTo", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Maximum salary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
