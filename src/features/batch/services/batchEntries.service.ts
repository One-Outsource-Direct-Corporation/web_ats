import type { PositionFormData } from "@/features/external_posting";
import type {
  BatchEntry,
  BatchEntryDb,
  BatchEntryLocal,
} from "../types/batch.types";
import { matchesBatchId } from "../utils/batchEntries.utils";

export function addBatch(
  prev: PositionFormData,
  batch: BatchEntryLocal,
): PositionFormData {
  return {
    ...prev,
    batches: [...prev.batches, batch],
  };
}

export function updateBatch(
  prev: PositionFormData,
  id: string | number,
  batch: Partial<BatchEntry>,
): PositionFormData {
  return {
    ...prev,
    batches: prev.batches.map((item) =>
      matchesBatchId(item, id) ? { ...item, ...batch } : item,
    ),
  };
}

export function deleteBatch(
  prev: PositionFormData,
  id: string | number,
): PositionFormData {
  return {
    ...prev,
    batches: prev.batches
      .map((batch) =>
        typeof id === "number" && (batch as BatchEntryDb).id === id
          ? { ...batch, _delete: true }
          : batch,
      )
      .filter(
        (batch) =>
          !(typeof id === "string" && (batch as BatchEntryLocal).tempId === id),
      ),
  };
}
