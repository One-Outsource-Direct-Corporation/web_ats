import type { BatchEntryDb } from "../../batch/types/batch.types";
import type { PositionFormData } from "@/features/external_posting";
import type {
  LocationEntry,
  LocationEntryDb,
  LocationEntryLocal,
} from "../types/location.types";
import { matchesLocationId } from "../utils/locationEntries.utils";

export function addLocation(
  prev: PositionFormData,
  location: LocationEntryLocal,
): PositionFormData {
  return {
    ...prev,
    locations: [...prev.locations, location],
  };
}

export function updateLocation(
  prev: PositionFormData,
  id: string | number,
  location: Partial<LocationEntry>,
): PositionFormData {
  const shouldCleanupBatches = location.with_batch === false;

  const updatedBatches = shouldCleanupBatches
    ? (prev.batches
        .map((batch) => {
          const batchBelongsToLocation = batch.location === id;
          if (!batchBelongsToLocation) {
            return batch;
          }

          if ("id" in batch && typeof (batch as BatchEntryDb).id === "number") {
            return { ...batch, _delete: true };
          }

          return null;
        })
        .filter((batch) => batch !== null) as typeof prev.batches)
    : prev.batches;

  return {
    ...prev,
    locations: prev.locations.map((loc) =>
      matchesLocationId(loc, id) ? { ...loc, ...location } : loc,
    ),
    batches: updatedBatches,
  };
}

export function deleteLocation(
  prev: PositionFormData,
  id: string | number,
): PositionFormData {
  const updatedBatches = prev.batches
    .map((batch) => {
      const batchBelongsToLocation = batch.location === id;
      if (!batchBelongsToLocation) {
        return batch;
      }

      if ("id" in batch && typeof (batch as BatchEntryDb).id === "number") {
        return { ...batch, _delete: true };
      }

      return null;
    })
    .filter((batch) => batch !== null) as typeof prev.batches;

  return {
    ...prev,
    locations: prev.locations
      .map((location) =>
        typeof id === "number" && (location as LocationEntryDb).id === id
          ? { ...location, _delete: true }
          : location,
      )
      .filter(
        (location) =>
          !(
            typeof id === "string" &&
            (location as LocationEntryLocal).tempId === id
          ),
      ),
    batches: updatedBatches,
  };
}
