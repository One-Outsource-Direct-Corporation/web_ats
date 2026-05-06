export interface LocationEntryBase {
  name: string;
  headcount: number | null;
  deployment_date: string | null;
  with_batch: boolean;
}

export interface LocationEntryLocal extends LocationEntryBase {
  tempId: string;
}

export interface LocationEntryDb extends LocationEntryBase {
  id: number;
  _delete?: boolean;
}

export type LocationEntry = LocationEntryLocal | LocationEntryDb;
