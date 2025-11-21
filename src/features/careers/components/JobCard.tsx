import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { calculateDaysAgo } from "../utils/filterJobs";
import DOMPurify from "dompurify";
import formatName from "@/shared/utils/formatName";
import type { JobPostingResponse } from "@/features/jobs/types/job.types";

export const JobCard = ({ job }: { job: JobPostingResponse }) => {
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

        {job.department_name && (
          <div className="text-sm text-gray-600 mb-3">
            {formatName(job.department_name)}
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
          {job.work_setup && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {formatName(job.work_setup)}
            </span>
          )}

          {job.employment_type && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {formatName(job.employment_type)}
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
