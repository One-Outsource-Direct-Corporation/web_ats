export type Job = {
  id: string;
  title: string;
  department: string;
  description?: string;
  employmentType?: string;
  status?: string;
  created?: string;
  totalCandidates?: number;
  vacancies?: number;
};
