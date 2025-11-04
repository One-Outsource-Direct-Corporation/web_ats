import type {
  LocationEntry,
  LocationEntryDb,
  LocationEntryLocal,
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
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.map((loc) => {
        const match =
          typeof id === "string"
            ? (loc as LocationEntryLocal).tempId === id
            : (loc as LocationEntryDb).id === id;
        return match ? { ...loc, ...location } : loc;
      }),
    }));
  }

  function deleteLocationEntry(id: string | number) {
    setFormData((prev) => ({
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
    }));
  }

  return {
    locations,
    addLocationEntry,
    updateLocationEntry,
    deleteLocationEntry,
  };
};
