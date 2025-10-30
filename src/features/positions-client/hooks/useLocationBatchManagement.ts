import { useState } from "react";
import type { LocationEntry, BatchEntry } from "../types/create_position.types";

export const useLocationBatchManagement = () => {
  const [locations, setLocations] = useState<LocationEntry[]>([
    {
      id: 1,
      location: "Makati City",
      headcount: 100,
      deploymentDate: "Oct 01, 2024",
      withBatch: true,
    },
  ]);

  const [batches, setBatches] = useState<BatchEntry[]>([
    {
      id: 1,
      batch: 1,
      headcount: 5,
      deploymentDate: "Oct 01, 2024",
    },
    {
      id: 2,
      batch: 2,
      headcount: 5,
      deploymentDate: "Jul 08, 2022",
    },
  ]);

  const [editingLocationId, setEditingLocationId] = useState<number | null>(
    null
  );
  const [editingBatchId, setEditingBatchId] = useState<number | null>(null);

  const addLocation = () => {
    const newLocation: LocationEntry = {
      id: locations.length + 1,
      location: "",
      headcount: 0,
      deploymentDate: "",
      withBatch: false,
    };
    setLocations([...locations, newLocation]);
  };

  const deleteLocation = (id: number) => {
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  const handleEditLocation = (id: number) => {
    setEditingLocationId(id);
  };

  const handleLocationChange = (
    id: number,
    field: keyof LocationEntry,
    value: any
  ) => {
    setLocations((prevLocations) =>
      prevLocations.map((loc) =>
        loc.id === id ? { ...loc, [field]: value } : loc
      )
    );
  };

  const addBatch = () => {
    const newBatch: BatchEntry = {
      id: batches.length + 1,
      batch: batches.length + 1,
      headcount: 0,
      deploymentDate: "",
    };
    setBatches([...batches, newBatch]);
  };

  const deleteBatch = (id: number) => {
    setBatches(batches.filter((batch) => batch.id !== id));
  };

  const handleEditBatch = (id: number) => {
    setEditingBatchId(id);
  };

  const handleBatchChange = (id: number, field: string, value: any) => {
    setBatches((prevBatches) =>
      prevBatches.map((batch) =>
        batch.id === id ? { ...batch, [field]: value } : batch
      )
    );
  };

  return {
    locations,
    batches,
    editingLocationId,
    editingBatchId,
    setEditingLocationId,
    setEditingBatchId,
    addLocation,
    deleteLocation,
    handleEditLocation,
    handleLocationChange,
    addBatch,
    deleteBatch,
    handleEditBatch,
    handleBatchChange,
  };
};
