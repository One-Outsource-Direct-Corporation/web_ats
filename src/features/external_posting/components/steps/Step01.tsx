import { useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Card } from "@/shared/components/ui/card";
import { BasicDetailsForm } from "../BasicDetailsForm";
import {
  LocationManagement,
  useLocationEntries,
  type LocationEntryDb,
  type LocationEntryLocal,
} from "@/features/location";
import {
  BatchManagement,
  useBatchEntries,
  type BatchEntryDb,
  type BatchEntryLocal,
} from "@/features/batch";
import type {
  PositionBase,
  PositionFormData,
} from "../../types/externalPosting.types";
import type { ValidationError } from "../../utils/validateSteps";

interface Step01Props {
  formData: PositionFormData;
  setFormData: Dispatch<SetStateAction<PositionFormData>>;
  handleInputChange: (
    fieldName: keyof PositionBase,
    value: string | number | null,
  ) => void;
  handleJobPostingChange: (
    fieldName: keyof PositionFormData["job_posting"],
    value: string | number | null,
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

  const computedTotalHeadcount = useMemo(() => {
    return locations.reduce((total, loc) => {
      if ((loc as LocationEntryDb)._delete) return total;

      const locId =
        (loc as LocationEntryDb).id ?? (loc as LocationEntryLocal).tempId;

      if (loc.with_batch) {
        const batchSum = batches
          .filter(
            (b) =>
              b.location === locId &&
              !(b as BatchEntryDb)._delete,
          )
          .reduce((sum, b) => sum + (b.headcount || 0), 0);
        return total + batchSum;
      }

      return total + (loc.headcount ?? 0);
    }, 0);
  }, [locations, batches]);

  return (
    <Card className="p-6">
      <BasicDetailsForm
        formData={formData}
        onInputChange={handleInputChange}
        handleJobPostingChange={handleJobPostingChange}
        errorFields={error ?? null}
        computedHeadcount={computedTotalHeadcount || null}
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
