import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
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
import type {
  LocationEntryDb,
  LocationEntryLocal,
} from "../../types/location_and_batch.types";
import type { ValidationError } from "../../utils/validateSteps";

interface Step01Props {
  formData: PositionFormData;
  setFormData: Dispatch<SetStateAction<PositionFormData>>;
  handleInputChange: (
    fieldName: keyof PositionBase,
    value: string | number | null
  ) => void;
  handleJobPostingChange: (
    fieldName: keyof PositionFormData["job_posting"],
    value: string | number | null
  ) => void;
  error?: ValidationError | null;
}

export default function Step01({
  formData,
  setFormData,
  handleInputChange,
  handleJobPostingChange,
  error,
}: Step01Props) {
  const {
    locations,
    addLocationEntry,
    updateLocationEntry,
    deleteLocationEntry,
  } = useLocationEntries(formData.locations, setFormData);
  const { batches, addBatchEntry, updateBatchEntry, deleteBatchEntry } =
    useBatchEntries(formData.batches, setFormData);

  const [selectedLocationId, setSelectedLocationId] = useState<
    number | string | null
  >(null);
  const selectedLocation = locations.find((loc) => {
    const id =
      (loc as LocationEntryDb).id ?? (loc as LocationEntryLocal).tempId;
    return id === selectedLocationId;
  });

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
        batches={batches}
        selectedLocationId={selectedLocationId}
        onLocationSelect={handleLocationSelect}
        onAddLocation={addLocationEntry}
        onUpdateLocation={updateLocationEntry}
        onDeleteLocation={deleteLocationEntry}
      />

      {selectedLocation?.with_batch && (
        <BatchManagement
          batches={batches}
          selectedLocationId={selectedLocationId}
          onAddBatch={addBatchEntry}
          onUpdateBatch={updateBatchEntry}
          onDeleteBatch={deleteBatchEntry}
          selectedLocationName={selectedLocation.name}
        />
      )}
    </Card>
  );
}
