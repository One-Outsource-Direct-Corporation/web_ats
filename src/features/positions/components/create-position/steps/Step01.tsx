import { Card } from "@/shared/components/ui/card";
import { BasicDetailsForm } from "../form-management/BasicDetailsForm";
import type { CreatePositionFormData } from "@/features/positions/types/createPosition";
// import { LocationManagement } from "../location-management/LocationManagement";
// import { BatchManagement } from "../location-management/BatchManagement";

interface Step01Props {
  formData: CreatePositionFormData;
  handleInputChange: (field: string, value: string) => void;
}

export default function Step01({ formData, handleInputChange }: Step01Props) {
  return (
    <Card className="p-6">
      <BasicDetailsForm formData={formData} onInputChange={handleInputChange} />

      <p className="text-muted bg-stone-400 text-center rounded-lg p-2 w-[40rem] mx-auto">
        <code>LocationManagement</code> and <code>BatchManagement</code> are
        commented out
      </p>

      {/* <LocationManagement
        locations={locationBatchHooks.locations}
        editingLocationId={locationBatchHooks.editingLocationId}
        onLocationChange={locationBatchHooks.handleLocationChange}
        onEditLocation={locationBatchHooks.handleEditLocation}
        onDeleteLocation={locationBatchHooks.deleteLocation}
        onAddLocation={locationBatchHooks.addLocation}
        setEditingLocationId={locationBatchHooks.setEditingLocationId}
      />

      <BatchManagement
        batches={locationBatchHooks.batches}
        locations={locationBatchHooks.locations}
        editingBatchId={locationBatchHooks.editingBatchId}
        onBatchChange={locationBatchHooks.handleBatchChange}
        onEditBatch={locationBatchHooks.handleEditBatch}
        onDeleteBatch={locationBatchHooks.deleteBatch}
        onAddBatch={locationBatchHooks.addBatch}
        setEditingBatchId={locationBatchHooks.setEditingBatchId}
      /> */}
    </Card>
  );
}
