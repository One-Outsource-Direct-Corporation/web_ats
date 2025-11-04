import { useEffect, useState } from "react";
import type {
  BatchEntry,
  BatchEntryDb,
  BatchEntryLocal,
} from "../types/location_and_batch.types";
import { fakeBatchesData } from "../data-dev/batches.data";

export const useBatchEntries = (formData?: BatchEntry[]) => {
  const [batches, setBatches] = useState<BatchEntry[]>(formData || []);

  //   useEffect(() => {
  //     if (import.meta.env.VITE_REACT_ENV === "development") {
  //       setBatches(fakeBatchesData);
  //     }
  //   }, []);

  function addBatchEntry(data: BatchEntryLocal) {
    data.tempId = `tmp-${Date.now()}`;
    setBatches((prevBatches) => [...prevBatches, data]);
  }

  function updateBatchEntry(
    id: string | number,
    field: keyof BatchEntry,
    value: string | number | null
  ) {
    setBatches((prevBatches) =>
      prevBatches.map((batch) => {
        const match =
          typeof id === "string"
            ? (batch as BatchEntryLocal).tempId === id
            : (batch as BatchEntryDb).id === id;
        return match ? { ...batch, [field]: value } : batch;
      })
    );
  }

  function deleteBatchEntry(id: string | number) {
    setBatches((prevBatches) =>
      prevBatches
        .map((batch) =>
          typeof id === "number" && (batch as BatchEntryDb).id === id
            ? { ...batch, _delete: true }
            : batch
        )
        .filter(
          (batch) =>
            !(
              typeof id === "string" && (batch as BatchEntryLocal).tempId === id
            )
        )
    );
  }

  return {
    batches,
    addBatchEntry,
    updateBatchEntry,
    deleteBatchEntry,
  };
};
