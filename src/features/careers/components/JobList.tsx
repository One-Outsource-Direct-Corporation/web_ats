import { JobCard } from "./JobCard";
import type { JobPostingAPIResponse } from "@/features/jobs/types/jobTypes";

interface JobListProps {
  jobs: JobPostingAPIResponse;
}

export const JobList: React.FC<JobListProps> = ({ jobs }) => {
  if (jobs.results.length === 0) {
    return (
      <div className="mx-auto max-w-6xl mt-6 mb-16 bg-white rounded-lg shadow-sm p-6 relative z-20">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No jobs found matching your criteria.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your filters or search terms.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl mt-6 mb-16 bg-white rounded-lg shadow-sm p-6 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.results.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};
