import { Button } from "@/shared/components/ui/button";
import type { JobData } from "../types/job";
import { useNavigate } from "react-router-dom";
import { calculateDaysAgo } from "../utils/filterJobs";

interface JobCardProps {
  job: JobData;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  //   const IconComponent = job.icon;
  const navigate = useNavigate();

  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-xl/20 hover:shadow-md transition-shadow">
      {/* Header with Icon and Title */}
      <div className="flex items-start gap-3 mb-3">
        {/* <IconComponent className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" /> */}
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
          {job.job_title}
        </h3>
      </div>

      {/* Department and Role */}
      <div className="text-sm text-gray-600 mb-3">
        {/* {job.department} •{" "}
        {job.work_setup.charAt(0).toUpperCase() + job.work_setup.slice(1)} */}
        {job.department}
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {`${job.description.slice(0, 100)}${
          job.description.length > 100 ? "..." : ""
        }`}
      </p>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
          {job.work_setup_display}
        </span>
        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
          {job.employment_type_display}
        </span>
        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
          {job.experience_level_display}
        </span>
        {/* {job.filters.map((filter, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
          >
            {filter}
          </span> */}
      </div>

      {/* Footer */}
      <div className="space-y-3">
        <div className="text-sm text-gray-500">
          Opened {calculateDaysAgo(job.created_at)} days ago
          {/* <span className="text-green-600 font-medium">
            {job.applicants} Applicants
          </span> */}
        </div>
        <div className="flex justify-end">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate(`/careers/${job.id}`)}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};
