import type {
  LocationEntry,
  LocationEntryDb,
  LocationEntryLocal,
  BatchEntryDb,
} from "../types/location_and_batch.types";
import type { PositionFormData } from "../types/create_position.types";
import type { Dispatch, SetStateAction } from "react";

export const useLocationEntries = (
  locations: LocationEntry[],
  setFormData: Dispatch<SetStateAction<PositionFormData>>
) => {
  function addLocationEntry(data: LocationEntryLocal) {
    setFormData((prev) => ({
      ...prev,
      locations: [...prev.locations, data],
    }));
  }

  function updateLocationEntry(
    id: string | number,
    location: Partial<LocationEntry>
  ) {
    setFormData((prev) => {
      // Check if with_batch is being set to false
      const shouldCleanupBatches = location.with_batch === false;

      let updatedBatches = prev.batches;
      if (shouldCleanupBatches) {
        // Remove or mark for deletion all batches for this location
        updatedBatches = prev.batches
          .map((batch) => {
            const batchBelongsToLocation = batch.location === id;
            if (batchBelongsToLocation) {
              // If it's a DB entry, mark for deletion
              if (
                "id" in batch &&
                typeof (batch as BatchEntryDb).id === "number"
              ) {
                return { ...batch, _delete: true };
              }
              // If it's a local entry, we'll filter it out
              return null;
            }
            return batch;
          })
          .filter((batch) => batch !== null) as typeof prev.batches;
      }

      return {
        ...prev,
        locations: prev.locations.map((loc) => {
          const match =
            typeof id === "string"
              ? (loc as LocationEntryLocal).tempId === id
              : (loc as LocationEntryDb).id === id;
          return match ? { ...loc, ...location } : loc;
        }),
        batches: updatedBatches,
      };
    });
  }

  function deleteLocationEntry(id: string | number) {
    setFormData((prev) => {
      // Remove or mark for deletion all batches for this location
      const updatedBatches = prev.batches
        .map((batch) => {
          const batchBelongsToLocation = batch.location === id;
          if (batchBelongsToLocation) {
            // If it's a DB entry, mark for deletion
            if (
              "id" in batch &&
              typeof (batch as BatchEntryDb).id === "number"
            ) {
              return { ...batch, _delete: true };
            }
            // If it's a local entry, we'll filter it out
            return null;
          }
          return batch;
        })
        .filter((batch) => batch !== null) as typeof prev.batches;

      return {
        ...prev,
        locations: prev.locations
          .map((location) =>
            typeof id === "number" && (location as LocationEntryDb).id === id
              ? { ...location, _delete: true }
              : location
          )
          .filter(
            (location) =>
              !(
                typeof id === "string" &&
                (location as LocationEntryLocal).tempId === id
              )
          ),
        batches: updatedBatches,
      };
    });
  }

  return {
    locations,
    addLocationEntry,
    updateLocationEntry,
    deleteLocationEntry,
  };
};
