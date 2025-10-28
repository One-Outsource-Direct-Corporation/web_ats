import { Button } from "@/shared/components/ui/button";
import type { JobData } from "../../types/job.types";

interface ApplicationHeaderProps {
  job: JobData;
  onViewJobDescription: () => void;
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  job,
  onViewJobDescription,
}) => {
  return (
    <header className="hidden lg:block bg-white shadow-sm p-6 border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">{job.job_title}</h1>
        </div>
        <Button
          onClick={onViewJobDescription}
          className="text-blue-600 border-1 border-blue-600 hover:bg-blue-50 bg-transparent"
        >
          View Job Description
        </Button>
      </div>
    </header>
  );
};
