import type { JobData, JobFilters } from "../types/job.types";

export const calculateDaysAgo = (dateString: string): number => {
  const createdDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const filterJobs = (
  jobs: JobData[],
  filters: JobFilters,
  isSearchActive: boolean
): JobData[] => {
  if (!isSearchActive) {
    return jobs;
  }

  return jobs.filter((job) => {
    const matchesSearch =
      filters.searchTerm === "" ||
      job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesCategory =
      filters.categoryFilter === "All" ||
      job.category === filters.categoryFilter;

    const matchesWorkType =
      filters.workTypeFilter === "All" ||
      job.workType === filters.workTypeFilter;

    const matchesWorkSetup =
      filters.workSetupFilter === "All" ||
      job.workSetup === filters.workSetupFilter;

    return (
      matchesSearch && matchesCategory && matchesWorkType && matchesWorkSetup
    );
  });
};
