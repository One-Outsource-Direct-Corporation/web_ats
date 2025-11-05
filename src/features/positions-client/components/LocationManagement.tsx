import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Plus, Trash2, Edit, Check, X, Eye } from "lucide-react";
import type {
  BatchEntry,
  LocationEntry,
  LocationEntryDb,
  LocationEntryLocal,
} from "../types/location_and_batch.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import formatDate from "@/shared/utils/formatDate";

interface LocationManagementProps {
  locations: LocationEntry[];
  batches: BatchEntry[];
  selectedLocationId: string | number | null;
  onLocationSelect: (id: string | number) => void;
  onAddLocation: (location: LocationEntryLocal) => void;
  onUpdateLocation: (id: string | number, location: LocationEntry) => void;
  onDeleteLocation: (id: string | number) => void;
}

export const LocationManagement = ({
  locations,
  batches,
  selectedLocationId,
  onLocationSelect,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation,
}: LocationManagementProps) => {
  const [newLocation, setNewLocation] = useState<
    Omit<LocationEntryLocal, "tempId">
  >({
    name: "",
    headcount: 0,
    deploymentDate: null,
    withBatch: false,
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<
    string | number | null
  >(null);
  const [editFormData, setEditFormData] = useState<
    Omit<LocationEntry, "id" | "tempId">
  >({
    name: "",
    headcount: 0,
    deploymentDate: null,
    withBatch: false,
  });

  const handleStartEdit = (location: LocationEntry) => {
    setEditFormData({
      name: location.name,
      headcount: location.headcount,
      deploymentDate: location.deploymentDate || null,
      withBatch: location.withBatch,
    });
    setEditingLocationId(
      (location as LocationEntryDb).id ??
        (location as LocationEntryLocal).tempId ??
        null
    );
  };

  const handleSaveEdit = (id: string | number) => {
    if (editFormData.name.trim()) {
      if (typeof id === "number") {
        onUpdateLocation(id, editFormData as LocationEntryDb);
      } else {
        onUpdateLocation(id, editFormData as LocationEntryLocal);
      }
      setEditingLocationId(null);
      setEditFormData({
        name: "",
        headcount: 0,
        deploymentDate: null,
        withBatch: false,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingLocationId(null);
    setEditFormData({
      name: "",
      headcount: 0,
      deploymentDate: null,
      withBatch: false,
    });
  };

  const handleAddNewLocation = () => {
    if (newLocation.name.trim() && newLocation.deploymentDate) {
      onAddLocation({ ...newLocation, tempId: `tmp-${Date.now()}` });
      setNewLocation({
        name: "",
        headcount: 0,
        deploymentDate: null,
        withBatch: false,
      });
      setIsAddingNew(false);
    }
  };

  const handleCancelAdd = () => {
    setNewLocation({
      name: "",
      headcount: 0,
      deploymentDate: null,
      withBatch: false,
    });
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
              <th className="px-4 py-3 text-left">Total Headcount</th>
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
                    placeholder="Enter headcount"
                    type="number"
                    min="1"
                    value={newLocation.headcount || ""}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        headcount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full"
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-600">-</span>
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="date"
                    value={
                      newLocation.deploymentDate
                        ? new Date(newLocation.deploymentDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        deploymentDate: e.target.value
                          ? new Date(e.target.value)
                          : null,
                      })
                    }
                    className="w-full"
                  />
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={newLocation.withBatch ? "true" : "false"}
                    onValueChange={(value) =>
                      setNewLocation((prev) => ({
                        ...prev,
                        withBatch: value === "true",
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="With Batch?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
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
            {locations.map((location) => {
              const locId =
                (location as LocationEntryDb).id ??
                (location as LocationEntryLocal).tempId;

              const batchHeadcount = batches
                .filter((batch) => batch.location_entry === locId)
                .reduce((sum, batch) => sum + (batch.headcount || 0), 0);

              const totalHeadcount = location.headcount + batchHeadcount;

              return (
                <tr
                  key={locId}
                  className={`border-t hover:bg-gray-50 ${
                    selectedLocationId === locId ? "bg-blue-100" : ""
                  }`}
                >
                  <td
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => onLocationSelect(locId)}
                  >
                    {editingLocationId === locId ? (
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
                    {editingLocationId === locId ? (
                      <Input
                        type="number"
                        min="1"
                        value={editFormData.headcount}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            headcount: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      <span className="text-gray-600">
                        {location.headcount}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-600">
                      {location.withBatch ? totalHeadcount : "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {editingLocationId === locId ? (
                      <Input
                        type="date"
                        value={
                          editFormData.deploymentDate
                            ?.toISOString()
                            .split("T")[0] || ""
                        }
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            deploymentDate: new Date(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      <span className="text-gray-600">
                        {formatDate(
                          location.deploymentDate
                            ?.toISOString()
                            .split("T")[0] || ""
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingLocationId === locId ? (
                      <Select
                        value={editFormData.withBatch ? "true" : "false"}
                        onValueChange={(value) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            withBatch: value === "true",
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="With Batch?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-green-600 font-medium">
                        {location.withBatch ? "Yes" : "No"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {editingLocationId === locId ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveEdit(locId)}
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
                            onClick={() => onLocationSelect(locId)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteLocation(locId)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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
