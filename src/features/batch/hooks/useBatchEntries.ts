import type { Dispatch, SetStateAction } from "react";
import type { PositionFormData } from "@/features/external_posting";
import type { BatchEntry, BatchEntryLocal } from "../types/batch.types";
import {
  addBatch,
  deleteBatch,
  updateBatch,
} from "../services/batchEntries.service";

export const useBatchEntries = (
  batches: BatchEntry[],
  setFormData: Dispatch<SetStateAction<PositionFormData>>,
) => {
  function addBatchEntry(data: BatchEntryLocal) {
    setFormData((prev) =>
      addBatch(prev, {
        ...data,
        tempId: data.tempId || `tmp-${Date.now()}`,
      }),
    );
  }

  function updateBatchEntry(id: string | number, batch: Partial<BatchEntry>) {
    setFormData((prev) => updateBatch(prev, id, batch));
  }

  function deleteBatchEntry(id: string | number) {
    setFormData((prev) => deleteBatch(prev, id));
  }

  return {
    batches,
    addBatchEntry,
    updateBatchEntry,
    deleteBatchEntry,
  };
};
