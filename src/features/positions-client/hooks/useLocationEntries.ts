import { useEffect, useState } from "react";
import type {
  LocationEntry,
  LocationEntryDb,
  LocationEntryLocal,
} from "../types/location_and_batch.types";

export const useLocationEntries = (formData?: LocationEntry[]) => {
  const [locations, setLocations] = useState<LocationEntry[]>(formData || []);

  useEffect(() => {}, []);

  function addLocationEntry(data: LocationEntryLocal) {
    setLocations((prevLocations) => [...prevLocations, data]);
  }

  function updateLocationEntry(
    id: string | number,
    location: Partial<LocationEntry>
  ) {
    setLocations((prevLocations) =>
      prevLocations.map((loc) => {
        const match =
          typeof id === "string"
            ? (loc as LocationEntryLocal).tempId === id
            : (loc as LocationEntryDb).id === id;
        return match ? { ...loc, ...location } : loc;
      })
    );
  }

  function deleteLocationEntry(id: string | number) {
    setLocations((prevLocations) =>
      prevLocations
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
        )
    );
  }

  return {
    locations,
    addLocationEntry,
    updateLocationEntry,
    deleteLocationEntry,
  };
};
