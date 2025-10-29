import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Plus, Trash2, Edit, Check, X } from "lucide-react";
import type { Batch, BatchFormData } from "../../../types/location-batch.types";

interface BatchManagementProps {
  batches: Batch[];
  selectedLocationId: string | null;
  selectedLocationName: string;
  editingBatchId: string | null;
  onAddBatch: (batch: BatchFormData) => void;
  onUpdateBatch: (id: string, batch: BatchFormData) => void;
  onDeleteBatch: (id: string) => void;
  onEditBatch: (id: string | null) => void;
}

export const BatchManagement: React.FC<BatchManagementProps> = ({
  batches,
  selectedLocationId,
  selectedLocationName,
  editingBatchId,
  onAddBatch,
  onUpdateBatch,
  onDeleteBatch,
  onEditBatch,
}) => {
  const [newBatch, setNewBatch] = useState<BatchFormData>({
    name: "",
    startTime: "",
    endTime: "",
    headcount: 0,
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editFormData, setEditFormData] = useState<BatchFormData>({
    name: "",
    startTime: "",
    endTime: "",
    headcount: 0,
  });

  const handleStartEdit = (batch: Batch) => {
    setEditFormData({
      name: batch.name,
      startTime: batch.startTime,
      endTime: batch.endTime,
      headcount: batch.headcount,
    });
    onEditBatch(batch.id);
  };

  const handleSaveEdit = (id: string) => {
    if (
      editFormData.name.trim() &&
      editFormData.startTime &&
      editFormData.endTime &&
      editFormData.headcount > 0
    ) {
      onUpdateBatch(id, editFormData);
    }
  };

  const handleCancelEdit = () => {
    onEditBatch(null);
    setEditFormData({ name: "", startTime: "", endTime: "", headcount: 0 });
  };

  const handleAddNewBatch = () => {
    if (
      selectedLocationId &&
      newBatch.name.trim() &&
      newBatch.startTime &&
      newBatch.endTime &&
      newBatch.headcount > 0
    ) {
      onAddBatch(newBatch);
      setNewBatch({ name: "", startTime: "", endTime: "", headcount: 0 });
      setIsAddingNew(false);
    }
  };

  const handleCancelAdd = () => {
    setNewBatch({ name: "", startTime: "", endTime: "", headcount: 0 });
    setIsAddingNew(false);
  };

  if (!selectedLocationId) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Batch Management
        </h3>
        <div className="text-center py-12 text-gray-500 border rounded-lg bg-gray-50">
          <p>Please select a location to manage batches.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">
          Batch Management - {selectedLocationName}
        </h3>
        <Button
          onClick={() => setIsAddingNew(true)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Batch
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg mb-4">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Batch Name</th>
              <th className="px-4 py-3 text-left">Start Time</th>
              <th className="px-4 py-3 text-left">End Time</th>
              <th className="px-4 py-3 text-left">Headcount</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isAddingNew && (
              <tr className="border-t bg-blue-50">
                <td className="px-4 py-3">
                  <Input
                    placeholder="Enter batch name"
                    value={newBatch.name}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, name: e.target.value })
                    }
                    className="w-full"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="time"
                    value={newBatch.startTime}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, startTime: e.target.value })
                    }
                    className="w-full"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="time"
                    value={newBatch.endTime}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, endTime: e.target.value })
                    }
                    className="w-full"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    min="1"
                    placeholder="headcount"
                    value={newBatch.headcount || ""}
                    onChange={(e) =>
                      setNewBatch({
                        ...newBatch,
                        headcount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleAddNewBatch}
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
            {batches.map((batch) => (
              <tr key={batch.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  {editingBatchId === batch.id ? (
                    <Input
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  ) : (
                    <span className="font-medium">{batch.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingBatchId === batch.id ? (
                    <Input
                      type="time"
                      value={editFormData.startTime}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          startTime: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  ) : (
                    <span className="text-gray-600">{batch.startTime}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingBatchId === batch.id ? (
                    <Input
                      type="time"
                      value={editFormData.endTime}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          endTime: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  ) : (
                    <span className="text-gray-600">{batch.endTime}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingBatchId === batch.id ? (
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
                    <span className="text-gray-600">{batch.headcount}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {editingBatchId === batch.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveEdit(batch.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(batch)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteBatch(batch.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {batches.length === 0 && !isAddingNew && (
        <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50">
          <p>
            No batches added for {selectedLocationName} yet. Click "Add Batch"
            to get started.
          </p>
        </div>
      )}
    </div>
  );
};
