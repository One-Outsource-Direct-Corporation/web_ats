interface LocationEntryBase {
  name: string;
  headcount: number;
  deployment_date: string | null;
  with_batch: boolean;
}

export interface LocationEntryLocal extends LocationEntryBase {
  tempId: string; // `tmp-${Date.now()}`
}

export interface LocationEntryDb extends LocationEntryBase {
  id: number;
}

interface BatchEntryBase {
  location: number | string;
  name: string;
  headcount: number;
  deployment_date: string | null;
}

export interface BatchEntryLocal extends BatchEntryBase {
  tempId: string; // `tmp-${Date.now()}`
}

export interface BatchEntryDb extends BatchEntryBase {
  id: number;
}

export type LocationEntry = LocationEntryLocal | LocationEntryDb;
export type BatchEntry = BatchEntryLocal | BatchEntryDb;
