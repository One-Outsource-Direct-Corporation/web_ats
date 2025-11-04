import { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { BasicDetailsForm } from "../BasicDetailsForm";
import { LocationManagement } from "../LocationManagement";
import { BatchManagement } from "../BatchManagement";
import type {
  PositionBase,
  PositionFormData,
} from "../../types/create_position.types";
import { useBatchEntries } from "../../hooks/useBatchEntries";
import { useLocationEntries } from "../../hooks/useLocationEntries";

interface Step01Props {
  formData: PositionFormData;
  handleInputChange: (
    fieldName: keyof PositionBase,
    value: string | number | null
  ) => void;
  handleJobPostingChange: (
    fieldName: keyof PositionFormData["job_posting"],
    value: string | number | null
  ) => void;
  error?: any;
}

export default function Step01({
  formData,
  handleInputChange,
  handleJobPostingChange,
  error,
}: Step01Props) {
  const [selectedLocationId, setSelectedLocationId] = useState<
    number | string | null
  >(null);
  const [editingLocationId, setEditingLocationId] = useState<
    number | string | null
  >(null);
  const [editingBatchId, setEditingBatchId] = useState<number | string | null>(
    null
  );
  const {
    locations,
    addLocationEntry,
    updateLocationEntry,
    deleteLocationEntry,
  } = useLocationEntries(formData.locations);
  const { batches, addBatchEntry, updateBatchEntry, deleteBatchEntry } =
    useBatchEntries(formData.batches);

  function handleLocationSelect(id: number | string | null) {
    setSelectedLocationId(id);
  }

  // const filteredBatches = selectedLocationId
  //   ? batches.filter((batch) => batch.locationId === selectedLocationId)
  //   : [];

  return (
    <Card className="p-6">
      <BasicDetailsForm
        formData={formData}
        onInputChange={handleInputChange}
        handleJobPostingChange={handleJobPostingChange}
        errorFields={error}
      />

      <LocationManagement
        locations={locations}
        selectedLocationId={selectedLocationId}
        onLocationSelect={handleLocationSelect}
        onAddLocation={addLocationEntry}
        onUpdateLocation={updateLocationEntry}
        onDeleteLocation={deleteLocationEntry}
      />

      {/* <BatchManagement
        batches={batches}
        selectedLocationId={selectedLocationId}
        onAddBatch={addBatchEntry}
        onUpdateBatch={updateBatchEntry}
        onDeleteBatch={deleteBatchEntry}
        onEditBatch={setEditingBatchId}
      /> */}
    </Card>
  );
}
