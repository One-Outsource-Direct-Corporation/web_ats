import { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { BasicDetailsForm } from "../BasicDetailsForm";
import { LocationManagement } from "../LocationManagement";
import { BatchManagement } from "../BatchManagement";
import type {
  PositionBase,
  PositionFormData,
} from "../../types/create_position.types";

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

// Test data for locations
const initialLocations = [
  {
    id: "1",
    name: "Makati City",
    address: "Ayala Avenue, Makati",
    deploymentDate: "2024-10-01",
  },
  {
    id: "2",
    name: "Quezon City",
    address: "Commonwealth Avenue, QC",
    deploymentDate: "2024-11-15",
  },
  {
    id: "3",
    name: "BGC Taguig",
    address: "5th Avenue, BGC",
    deploymentDate: "2024-12-05",
  },
];

// Test data for batches
const initialBatches = [
  {
    id: "1",
    locationId: "1",
    name: "Morning Batch A",
    startTime: "08:00",
    endTime: "12:00",
    headcount: 50,
  },
  {
    id: "2",
    locationId: "1",
    name: "Afternoon Batch B",
    startTime: "13:00",
    endTime: "17:00",
    headcount: 40,
  },
  {
    id: "3",
    locationId: "2",
    name: "QC Morning Shift",
    startTime: "09:00",
    endTime: "13:00",
    headcount: 30,
  },
  {
    id: "4",
    locationId: "2",
    name: "QC Evening Shift",
    startTime: "14:00",
    endTime: "18:00",
    headcount: 35,
  },
  {
    id: "5",
    locationId: "3",
    name: "BGC Day Shift",
    startTime: "08:30",
    endTime: "17:30",
    headcount: 60,
  },
];

export default function Step01({
  formData,
  handleInputChange,
  handleJobPostingChange,
  error,
}: Step01Props) {
  const [locations, setLocations] = useState(initialLocations);
  const [batches, setBatches] = useState(initialBatches);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [editingLocationId, setEditingLocationId] = useState<string | null>(
    null
  );
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);

  // Location is Local
  const handleAddLocation = (location: {
    name: string;
    address: string;
    deploymentDate: string;
  }) => {
    const newLocation = {
      id: Date.now().toString(),
      name: location.name,
      address: location.address,
      deploymentDate: location.deploymentDate || "",
    };
    setLocations((prev) => [...prev, newLocation]);
  };

  const handleUpdateLocation = (
    id: string,
    updates: { name: string; address: string; deploymentDate: string }
  ) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === id
          ? {
              ...loc,
              name: updates.name,
              address: updates.address,
              deploymentDate: updates.deploymentDate || "",
            }
          : loc
      )
    );
    setEditingLocationId(null);
  };

  const handleDeleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
    setBatches((prev) => prev.filter((batch) => batch.locationId !== id));
    if (selectedLocationId === id) {
      setSelectedLocationId(null);
    }
  };

  const handleLocationSelect = (id: string) => {
    setSelectedLocationId(id);
  };

  const handleAddBatch = (batch: {
    name: string;
    startTime: string;
    endTime: string;
    headcount: number;
  }) => {
    if (!selectedLocationId) return;

    const newBatch = {
      id: Date.now().toString(),
      locationId: selectedLocationId,
      ...batch,
    };
    setBatches((prev) => [...prev, newBatch]);
  };

  const handleUpdateBatch = (
    id: string,
    updates: {
      name: string;
      startTime: string;
      endTime: string;
      headcount: number;
    }
  ) => {
    setBatches((prev) =>
      prev.map((batch) => (batch.id === id ? { ...batch, ...updates } : batch))
    );
    setEditingBatchId(null);
  };

  const handleDeleteBatch = (id: string) => {
    setBatches((prev) => prev.filter((batch) => batch.id !== id));
  };

  const filteredBatches = selectedLocationId
    ? batches.filter((batch) => batch.locationId === selectedLocationId)
    : [];

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
        editingLocationId={editingLocationId}
        onLocationSelect={handleLocationSelect}
        onAddLocation={handleAddLocation}
        onUpdateLocation={handleUpdateLocation}
        onDeleteLocation={handleDeleteLocation}
        onEditLocation={setEditingLocationId}
      />

      <BatchManagement
        batches={filteredBatches}
        selectedLocationId={selectedLocationId}
        selectedLocationName={
          locations.find((loc) => loc.id === selectedLocationId)?.name || ""
        }
        editingBatchId={editingBatchId}
        onAddBatch={handleAddBatch}
        onUpdateBatch={handleUpdateBatch}
        onDeleteBatch={handleDeleteBatch}
        onEditBatch={setEditingBatchId}
      />
    </Card>
  );
}
