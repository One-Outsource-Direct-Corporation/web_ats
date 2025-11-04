import type { BatchEntry } from "../types/location_and_batch.types";

export const fakeBatchesData: BatchEntry[] = [
  {
    id: 1,
    location_entry_id: 1,
    name: "Batch 1 Local",
    headcount: 5,
    deploymentDate: new Date("2022-07-01"),
  },
  {
    tempId: `tmp-${Date.now()}`,
    location_entry_id: 1,
    name: "Batch 2 Db",
    headcount: 10,
    deploymentDate: new Date("2022-07-15"),
  },
];
