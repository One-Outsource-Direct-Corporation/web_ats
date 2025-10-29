export interface Location {
  id: string;
  name: string;
  address: string;
  deploymentDate: string;
}

export interface Batch {
  id: string;
  locationId: string;
  name: string;
  startTime: string;
  endTime: string;
  headcount: number;
}

export interface LocationFormData {
  name: string;
  address: string;
  deploymentDate: string;
}

export interface BatchFormData {
  name: string;
  startTime: string;
  endTime: string;
  headcount: number;
}
