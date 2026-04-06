export interface BatchEntryBase {
  location: number | string;
  name: string;
  district: string;
  headcount: number;
  deployment_date: string | null;
}

export interface BatchEntryLocal extends BatchEntryBase {
  tempId: string;
}

export interface BatchEntryDb extends BatchEntryBase {
  id: number;
  _delete?: boolean;
}

export type BatchEntry = BatchEntryLocal | BatchEntryDb;
