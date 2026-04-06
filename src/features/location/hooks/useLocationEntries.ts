import type { Dispatch, SetStateAction } from "react";
import type { PositionFormData } from "@/features/external_posting";
import type {
  LocationEntry,
  LocationEntryLocal,
} from "../types/location.types";
import {
  addLocation,
  deleteLocation,
  updateLocation,
} from "../services/locationEntries.service";

export const useLocationEntries = (
  locations: LocationEntry[],
  setFormData: Dispatch<SetStateAction<PositionFormData>>,
) => {
  function addLocationEntry(data: LocationEntryLocal) {
    setFormData((prev) => addLocation(prev, data));
  }

  function updateLocationEntry(
    id: string | number,
    location: Partial<LocationEntry>,
  ) {
    setFormData((prev) => updateLocation(prev, id, location));
  }

  function deleteLocationEntry(id: string | number) {
    setFormData((prev) => deleteLocation(prev, id));
  }

  return {
    locations,
    addLocationEntry,
    updateLocationEntry,
    deleteLocationEntry,
  };
};
