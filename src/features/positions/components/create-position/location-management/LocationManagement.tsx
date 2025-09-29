import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Plus, Trash2, Edit, Eye, Check } from "lucide-react";
import type { LocationEntry } from "../../../types/createPosition";

interface LocationManagementProps {
  locations: LocationEntry[];
  editingLocationId: number | null;
  onLocationChange: (
    id: number,
    field: keyof LocationEntry,
    value: any
  ) => void;
  onEditLocation: (id: number) => void;
  onDeleteLocation: (id: number) => void;
  onAddLocation: () => void;
  setEditingLocationId: (id: number | null) => void;
}

export const LocationManagement: React.FC<LocationManagementProps> = ({
  locations,
  editingLocationId,
  onLocationChange,
  onEditLocation,
  onDeleteLocation,
  onAddLocation,
  setEditingLocationId,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Location Details
      </h3>

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
                    <Checkbox
                      checked={location.withBatch}
                      onCheckedChange={(checked) =>
                        onLocationChange(location.id, "withBatch", checked)
                      }
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
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Edit className="w-4 h-4" />
                    )}
                  </Button>
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
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
  );
};
