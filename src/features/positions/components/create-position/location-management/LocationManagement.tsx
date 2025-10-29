import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Plus, Trash2, Edit, Check, X, Eye } from "lucide-react";
import type {
  Location,
  LocationFormData,
} from "../../../types/location-batch.types";

interface LocationManagementProps {
  locations: Location[];
  selectedLocationId: string | null;
  editingLocationId: string | null;
  onLocationSelect: (id: string) => void;
  onAddLocation: (location: LocationFormData) => void;
  onUpdateLocation: (id: string, location: LocationFormData) => void;
  onDeleteLocation: (id: string) => void;
  onEditLocation: (id: string | null) => void;
}

export const LocationManagement: React.FC<LocationManagementProps> = ({
  locations,
  selectedLocationId,
  editingLocationId,
  onLocationSelect,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation,
  onEditLocation,
}) => {
  const [newLocation, setNewLocation] = useState<LocationFormData>({
    name: "",
    address: "",
    deploymentDate: "",
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editFormData, setEditFormData] = useState<LocationFormData>({
    name: "",
    address: "",
    deploymentDate: "",
  });

  const handleStartEdit = (location: Location) => {
    setEditFormData({
      name: location.name,
      address: location.address,
      deploymentDate: location.deploymentDate || "",
    });
    onEditLocation(location.id);
  };

  const handleSaveEdit = (id: string) => {
    if (editFormData.name.trim() && editFormData.address.trim()) {
      onUpdateLocation(id, editFormData);
    }
  };

  const handleCancelEdit = () => {
    onEditLocation(null);
    setEditFormData({ name: "", address: "", deploymentDate: "" });
  };

  const handleAddNewLocation = () => {
    if (
      newLocation.name.trim() &&
      newLocation.address.trim() &&
      newLocation.deploymentDate
    ) {
      onAddLocation(newLocation);
      setNewLocation({ name: "", address: "", deploymentDate: "" });
      setIsAddingNew(false);
    }
  };

  const handleCancelAdd = () => {
    setNewLocation({ name: "", address: "", deploymentDate: "" });
    setIsAddingNew(false);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Location</h3>
        <Button
          onClick={() => setIsAddingNew(true)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg mb-4">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Headcount</th>
              <th className="px-4 py-3 text-left">Deployment Date</th>
              <th className="px-4 py-3 text-left">With Batch?</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isAddingNew && (
              <tr className="border-t bg-blue-50">
                <td className="px-4 py-3">
                  <Input
                    placeholder="Enter location name"
                    value={newLocation.name}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, name: e.target.value })
                    }
                    className="w-full"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    placeholder="Enter address"
                    value={newLocation.address}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        address: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="date"
                    value={newLocation.deploymentDate}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        deploymentDate: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleAddNewLocation}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelAdd}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            )}
            {locations.map((location) => (
              <tr
                key={location.id}
                className={`border-t hover:bg-gray-50 ${
                  selectedLocationId === location.id ? "bg-blue-100" : ""
                }`}
              >
                <td
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => onLocationSelect(location.id)}
                >
                  {editingLocationId === location.id ? (
                    <Input
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="font-medium">{location.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingLocationId === location.id ? (
                    <Input
                      value={editFormData.address}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          address: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  ) : (
                    <span className="text-gray-600">{location.address}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingLocationId === location.id ? (
                    <Input
                      type="date"
                      value={editFormData.deploymentDate}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          deploymentDate: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  ) : (
                    <span className="text-gray-600">
                      {location.deploymentDate
                        ? new Date(location.deploymentDate).toLocaleDateString(
                            undefined,
                            { month: "short", day: "2-digit", year: "numeric" }
                          )
                        : "-"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-green-600 font-medium">Yes</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {editingLocationId === location.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveEdit(location.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(location)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onLocationSelect(location.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteLocation(location.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {locations.length === 0 && !isAddingNew && (
        <div className="text-center py-8 text-gray-500">
          <p>No locations added yet. Click "Add Location" to get started.</p>
        </div>
      )}
    </div>
  );
};
