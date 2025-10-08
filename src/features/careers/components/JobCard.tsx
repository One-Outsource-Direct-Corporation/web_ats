import { Button } from "@/shared/components/ui/button";
import type { JobData } from "../types/job";
import { useNavigate } from "react-router-dom";
import { calculateDaysAgo } from "../utils/filterJobs";
import DOMPurify from "dompurify";
import formatName from "@/shared/utils/formatName";

interface JobCardProps {
  job: JobData;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  //   const IconComponent = job.icon;
  const navigate = useNavigate();

  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-xl/20 hover:shadow-md transition-shadow flex flex-col min-h-[300px]">
      <div className="flex-grow">
        <div className="mb-3">
          {/* <IconComponent className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" /> */}
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {job.job_title}
          </h3>
        </div>

        {job.department && job.client && (
          <div className="text-sm text-gray-600 mb-3">
            {formatName(job.department)} • {job.client}
          </div>
        )}

        {/* Description */}
        <div
          className="text-gray-700 text-sm mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(job.description),
          }}
        />
      </div>

      <div>
        <div className="flex flex-wrap gap-2 mb-4">
          {job.work_setup_display && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {job.work_setup_display}
            </span>
          )}

          {job.employment_type_display && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {job.employment_type_display}
            </span>
          )}
          {job.experience_level_display && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {job.experience_level_display}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500 flex items-center justify-between">
          <p>Opened {calculateDaysAgo(job.created_at)} days ago</p>

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
