import type {
  BatchEntry,
  BatchEntryDb,
  BatchEntryLocal,
} from "../types/location_and_batch.types";
import type { PositionFormData } from "../types/create_position.types";

export const useBatchEntries = (
  batches: BatchEntry[],
  setFormData: React.Dispatch<React.SetStateAction<PositionFormData>>
) => {
  function addBatchEntry(data: BatchEntryLocal) {
    data.tempId = `tmp-${Date.now()}`;
    setFormData((prevFormData) => ({
      ...prevFormData,
      batches: [...prevFormData.batches, data],
    }));
  }

  function updateBatchEntry(id: string | number, batch: Partial<BatchEntry>) {
    setFormData((prev) => ({
      ...prev,
      batches: prev.batches.map((bat) => {
        const match =
          typeof id === "string"
            ? (bat as BatchEntryLocal).tempId === id
            : (bat as BatchEntryDb).id === id;
        return match ? { ...bat, ...batch } : bat;
      }),
    }));
  }

  function deleteBatchEntry(id: string | number) {
    setFormData((prev) => ({
      ...prev,
      batches: prev.batches
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
        ),
    }));
  }

  return {
    batches,
    addBatchEntry,
    updateBatchEntry,
    deleteBatchEntry,
  };
};
