import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Plus, Trash2, Edit, Check, X } from "lucide-react";
import type {
  BatchEntry,
  BatchEntryDb,
  BatchEntryLocal,
} from "../types/location_and_batch.types";
import { formatDate } from "@/shared/utils/formatDate";

interface BatchManagementProps {
  batches: BatchEntry[];
  selectedLocationId: string | number | null;
  onAddBatch: (batch: BatchEntryLocal) => void;
  onUpdateBatch: (id: string | number, batch: BatchEntry) => void;
  onDeleteBatch: (id: string | number) => void;
  selectedLocationName?: string;
}

export const BatchManagement = ({
  batches,
  selectedLocationId,
  onAddBatch,
  onUpdateBatch,
  onDeleteBatch,
  selectedLocationName,
}: BatchManagementProps) => {
  const [newBatch, setNewBatch] = useState<
    Omit<BatchEntryLocal, "tempId" | "location">
  >({
    name: "",
    headcount: 0,
    deployment_date: null,
    district: "",
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingBatchId, setEditingBatchId] = useState<string | number | null>(
    null
  );
  const [editFormData, setEditFormData] = useState<
    Omit<BatchEntry, "id" | "tempId" | "location">
  >({
    name: "",
    headcount: 0,
    deployment_date: null,
    district: "",
  });

  // Reset form states when location changes
  useEffect(() => {
    setIsAddingNew(false);
    setEditingBatchId(null);
    setNewBatch({
      name: "",
      headcount: 0,
      deployment_date: null,
      district: "",
    });
    setEditFormData({
      name: "",
      headcount: 0,
      deployment_date: null,
      district: "",
    });
  }, [selectedLocationId]);

  const handleStartEdit = (batch: BatchEntry) => {
    setEditingBatchId(
      (batch as BatchEntryLocal).tempId ?? (batch as BatchEntryDb).id
    );
    setEditFormData({
      name: batch.name,
      headcount: batch.headcount,
      deployment_date: batch.deployment_date || null,
      district: batch.district,
    });
  };

  const handleSaveEdit = (id: string | number) => {
    if (
      editFormData.name.trim() &&
      editFormData.deployment_date &&
      editFormData.headcount > 0
    ) {
      if (typeof id === "string")
        onUpdateBatch(id, { ...editFormData, tempId: id } as BatchEntryLocal);
      else onUpdateBatch(id, { ...editFormData, id } as BatchEntryDb);

      setEditingBatchId(null);
      setEditFormData({
        name: "",
        headcount: 0,
        deployment_date: null,
        district: "",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingBatchId(null);
    setEditFormData({
      name: "",
      headcount: 0,
      deployment_date: null,
      district: "",
    });
  };

  const handleAddNewBatch = () => {
    if (
      selectedLocationId &&
      newBatch.name.trim() &&
      newBatch.headcount > 0 &&
      newBatch.deployment_date
    ) {
      onAddBatch({
        ...newBatch,
        tempId: `tmp-${Date.now()}`,
        location: selectedLocationId,
      });
      setNewBatch({
        name: "",
        headcount: 0,
        deployment_date: null,
        district: "",
      });
      setIsAddingNew(false);
    }
  };

  const handleCancelAdd = () => {
    setNewBatch({
      name: "",
      headcount: 0,
      deployment_date: null,
      district: "",
    });
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

  // Filter batches for the selected location and exclude deleted ones
  const filteredBatches = batches.filter(
    (batch) =>
      batch.location === selectedLocationId && !(batch as BatchEntryDb)._delete
  );

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">
          Batch Management{" "}
          {selectedLocationName ? `- ${selectedLocationName}` : ""}
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
              <th className="px-4 py-3 text-left">District</th>
              <th className="px-4 py-3 text-left">Headcount</th>
              <th className="px-4 py-3 text-left">Deployment Date</th>
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
                    placeholder="Enter district"
                    value={newBatch.district}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, district: e.target.value })
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
                  <Input
                    type="date"
                    value={
                      newBatch.deployment_date
                        ? new Date(newBatch.deployment_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setNewBatch({
                        ...newBatch,
                        deployment_date: e.target.value ? e.target.value : null,
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
            {filteredBatches.map((batch) => {
              const batchId =
                (batch as BatchEntryDb).id ?? (batch as BatchEntryLocal).tempId;
              return (
                <tr key={batchId} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {editingBatchId === batchId ? (
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
                    {editingBatchId === batchId ? (
                      <Input
                        placeholder="Enter district"
                        value={editFormData.district}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            district: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      <span className="text-gray-600">{batch.district}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingBatchId === batchId ? (
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
                    {editingBatchId === batchId ? (
                      <Input
                        type="date"
                        value={
                          editFormData.deployment_date
                            ? new Date(editFormData.deployment_date)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            deployment_date: e.target.value
                              ? e.target.value
                              : null,
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      <span className="text-gray-600">
                        {formatDate(
                          batch.deployment_date
                            ? batch.deployment_date.split("T")[0]
                            : ""
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {editingBatchId === batchId ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveEdit(batchId)}
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
                            onClick={() => onDeleteBatch(batchId)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {filteredBatches.length === 0 && !isAddingNew && (
        <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50">
          <p>
            No batches added
            {selectedLocationName ? ` for ${selectedLocationName}` : ""}
            yet. Click "Add Batch" to get started.
          </p>
        </div>
      )}
    </div>
  );
};
