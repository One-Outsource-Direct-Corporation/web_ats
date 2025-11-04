interface LocationEntryBase {
  name: string;
  headcount: number;
  deploymentDate: Date | null;
  withBatch: boolean;
}

export interface LocationEntryLocal extends LocationEntryBase {
  tempId: string; // `tmp-${Date.now()}`
}

export interface LocationEntryDb extends LocationEntryBase {
  id: number;
}

interface BatchEntryBase {
  location_entry: number | string;
  name: string;
  headcount: number;
  deploymentDate: Date | null;
}

export interface BatchEntryLocal extends BatchEntryBase {
  tempId: string; // `tmp-${Date.now()}`
}

export interface BatchEntryDb extends BatchEntryBase {
  id: number;
}

export type LocationEntry = LocationEntryLocal | LocationEntryDb;
export type BatchEntry = BatchEntryLocal | BatchEntryDb;
