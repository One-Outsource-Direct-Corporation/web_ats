import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Edit2, Trash2, Plus } from "lucide-react";
import type {
  FormData,
  LocationEntry,
  BatchEntry,
} from "../types/createNewPositionTypes";

interface DetailsStepProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
  locations: LocationEntry[];
  batches: BatchEntry[];
  editingLocationId: number | null;
  editingBatchId: number | null;
  onEditLocation: (id: number) => void;
  onLocationChange: (
    id: number,
    field: keyof LocationEntry,
    value: any
  ) => void;
  onEditBatch: (id: number) => void;
  onBatchChange: (id: number, field: keyof BatchEntry, value: any) => void;
  onAddLocation: () => void;
  onDeleteLocation: (id: number) => void;
  onAddBatch: () => void;
  onDeleteBatch: (id: number) => void;
  setEditingLocationId: (id: number | null) => void;
  setEditingBatchId: (id: number | null) => void;
}

export default function DetailsStep({
  formData,
  onInputChange,
  locations,
  batches,
  editingLocationId,
  editingBatchId,
  onEditLocation,
  onLocationChange,
  onEditBatch,
  onBatchChange,
  onAddLocation,
  onDeleteLocation,
  onAddBatch,
  onDeleteBatch,
  setEditingLocationId,
  setEditingBatchId,
}: DetailsStepProps) {
  return (
    <Card className="p-6">
      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <Input
            placeholder="Input text"
            value={formData.jobTitle}
            onChange={(e) => onInputChange("jobTitle", e.target.value)}
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            value={formData.department}
            onChange={(e) => onInputChange("department", e.target.value)}
          >
            <option value="">Input Text</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            value={formData.employmentType}
            onChange={(e) => onInputChange("employmentType", e.target.value)}
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* Education Needed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education Needed
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            value={formData.educationNeeded}
            onChange={(e) => onInputChange("educationNeeded", e.target.value)}
          >
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="High School">High School</option>
          </select>
        </div>

        {/* Work Setup */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work setup
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            value={formData.workSetup}
            onChange={(e) => onInputChange("workSetup", e.target.value)}
          >
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            value={formData.experience}
            onChange={(e) => onInputChange("experience", e.target.value)}
          >
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>

        {/* No. of headcounts needed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No. of headcounts needed
          </label>
          <Input
            placeholder="Input text"
            value={formData.headcountsNeeded}
            onChange={(e) => onInputChange("headcountsNeeded", e.target.value)}
          />
        </div>

        {/* Date Needed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Needed
          </label>
          <div className="relative">
            <Input
              type="date"
              placeholder="Input text"
              value={formData.dateNeeded}
              onChange={(e) => onInputChange("dateNeeded", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Reason for Hire */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Reason for Hire
        </h3>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reasonForHire"
              value="Replacement"
              checked={formData.reasonForHire === "Replacement"}
              onChange={(e) => onInputChange("reasonForHire", e.target.value)}
              className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
            />
            <span className="text-sm text-gray-700">Replacement</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reasonForHire"
              value="New Position"
              checked={formData.reasonForHire === "New Position"}
              onChange={(e) => onInputChange("reasonForHire", e.target.value)}
              className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
            />
            <span className="text-sm text-gray-700">New Position</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reasonForHire"
              value="Others, Please Specify"
              checked={formData.reasonForHire === "Others, Please Specify"}
              onChange={(e) => onInputChange("reasonForHire", e.target.value)}
              className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
            />
            <span className="text-sm text-gray-700">
              Others, Please Specify
            </span>
          </label>
          {formData.reasonForHire === "Others, Please Specify" && (
            <Input
              placeholder="Input text"
              className="ml-6 max-w-xs"
              value={formData.reasonSpecify}
              onChange={(e) => onInputChange("reasonSpecify", e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Budget Allocation */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Budget Allocation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <Input
              placeholder="₱ 20,000"
              value={formData.budgetFrom}
              onChange={(e) => onInputChange("budgetFrom", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <Input
              placeholder="₱ 25,000"
              value={formData.budgetTo}
              onChange={(e) => onInputChange("budgetTo", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Location</h3>

        {/* Location Table */}
        <div className="overflow-x-auto border rounded-lg mb-4">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Headcount</th>
                <th className="px-4 py-3 text-left">Deployment Date</th>
                <th className="px-4 py-3 text-left">With Batch?</th>
                <th className="px-4 py-3 text-left">Edit</th>
                <th className="px-4 py-3 text-left">View</th>
                <th className="px-4 py-3 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.id} className="border-t">
                  <td className="px-4 py-3">
                    {editingLocationId === location.id ? (
                      <select
                        className="w-full p-1 border rounded text-sm"
                        value={location.location}
                        onChange={(e) =>
                          onLocationChange(
                            location.id,
                            "location",
                            e.target.value
                          )
                        }
                      >
                        <option value="Makati City">Makati City</option>
                        <option value="Manila">Manila</option>
                        <option value="Quezon City">Quezon City</option>
                      </select>
                    ) : (
                      location.location
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingLocationId === location.id ? (
                      <Input
                        type="number"
                        value={location.headcount}
                        onChange={(e) =>
                          onLocationChange(
                            location.id,
                            "headcount",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full p-1 border rounded text-sm"
                      />
                    ) : (
                      location.headcount
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingLocationId === location.id ? (
                      <Input
                        type="date"
                        value={location.deploymentDate}
                        onChange={(e) =>
                          onLocationChange(
                            location.id,
                            "deploymentDate",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border rounded text-sm"
                      />
                    ) : (
                      location.deploymentDate
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingLocationId === location.id ? (
                      <input
                        type="checkbox"
                        checked={location.withBatch}
                        onChange={(e) =>
                          onLocationChange(
                            location.id,
                            "withBatch",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4"
                      />
                    ) : (
                      <span className="text-green-600 font-medium">
                        {location.withBatch ? "Yes" : "No"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (editingLocationId === location.id) {
                          setEditingLocationId(null); // Save/Exit edit mode
                        } else {
                          onEditLocation(location.id); // Enter edit mode
                        }
                      }}
                    >
                      {editingLocationId === location.id ? (
                        "✓"
                      ) : (
                        <Edit2 className="w-4 h-4" />
                      )}
                    </Button>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">
                      👁️
                    </Button>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteLocation(location.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button
          onClick={onAddLocation}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 p-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Batch Details */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Batch Details
        </h3>

        <div className="overflow-x-auto border rounded-lg mb-4">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Batch</th>
                <th className="px-4 py-3 text-left">Headcount</th>
                <th className="px-4 py-3 text-left">Deployment Date</th>
                <th className="px-4 py-3 text-left">Delete</th>
                <th className="px-4 py-3 text-left">Edit</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {editingBatchId === batch.id ? (
                      <Input
                        type="number"
                        value={batch.batch}
                        onChange={(e) =>
                          onBatchChange(
                            batch.id,
                            "batch",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full p-1 border rounded text-sm"
                      />
                    ) : (
                      batch.batch
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingBatchId === batch.id ? (
                      <Input
                        type="number"
                        value={batch.headcount}
                        onChange={(e) =>
                          onBatchChange(
                            batch.id,
                            "headcount",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full p-1 border rounded text-sm"
                      />
                    ) : (
                      batch.headcount
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingBatchId === batch.id ? (
                      <Input
                        type="date"
                        value={batch.deploymentDate}
                        onChange={(e) =>
                          onBatchChange(
                            batch.id,
                            "deploymentDate",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border rounded text-sm"
                      />
                    ) : (
                      batch.deploymentDate
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteBatch(batch.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (editingBatchId === batch.id) {
                          setEditingBatchId(null); // Save/Exit edit mode
                        } else {
                          onEditBatch(batch.id); // Enter edit mode
                        }
                      }}
                    >
                      {editingBatchId === batch.id ? (
                        "✓"
                      ) : (
                        <Edit2 className="w-4 h-4" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button
          onClick={onAddBatch}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 p-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
