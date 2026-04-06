import type { BatchEntry, BatchEntryDb, BatchEntryLocal } from "../types/batch.types";

export function matchesBatchId(batch: BatchEntry, id: string | number): boolean {
  return typeof id === "string"
    ? (batch as BatchEntryLocal).tempId === id
    : (batch as BatchEntryDb).id === id;
}
