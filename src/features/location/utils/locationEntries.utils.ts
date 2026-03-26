import type { LocationEntry, LocationEntryDb, LocationEntryLocal } from "../types/location.types";

export function matchesLocationId(location: LocationEntry, id: string | number): boolean {
  return typeof id === "string"
    ? (location as LocationEntryLocal).tempId === id
    : (location as LocationEntryDb).id === id;
}
