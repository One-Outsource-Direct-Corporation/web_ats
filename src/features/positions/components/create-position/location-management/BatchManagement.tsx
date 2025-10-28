import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Plus, Trash2, Edit, Check } from "lucide-react";
import type {
  BatchEntry,
  LocationEntry,
} from "@/features/positions/types/create_position.types";

interface BatchManagementProps {
  batches: BatchEntry[];
  locations: LocationEntry[];
  editingBatchId: number | null;
  onBatchChange: (id: number, field: string, value: any) => void;
  onEditBatch: (id: number) => void;
  onDeleteBatch: (id: number) => void;
  onAddBatch: () => void;
  setEditingBatchId: (id: number | null) => void;
}

export const BatchManagement: React.FC<BatchManagementProps> = ({
  batches,
  locations,
  editingBatchId,
  onBatchChange,
  onEditBatch,
  onDeleteBatch,
  onAddBatch,
  setEditingBatchId,
}) => {
  // Only show if any location has batches enabled
  const showBatchDetails = locations.some((loc) => loc.withBatch);

  if (!showBatchDetails) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Batch Details</h3>

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
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Edit className="w-4 h-4" />
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
  );
};
