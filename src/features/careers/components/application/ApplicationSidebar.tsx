import { ApplicationProgressSteps } from "./ApplicationProgressSteps";

interface ApplicationSidebarProps {
  currentStage: number;
  onLogoClick: () => void;
  jobTitle?: string;
}

export const ApplicationSidebar = ({
  currentStage,
  onLogoClick,
  jobTitle,
}: ApplicationSidebarProps) => {
  return (
    <div className="lg:w-80 bg-white shadow-lg lg:p-6 p-4 flex flex-col sticky top-0 lg:h-screen z-10 border-b lg:border-b-0 border-gray-200 lg:overflow-y-auto">
      {/* Logo */}
      <div
        className="mb-4 lg:mb-8 cursor-pointer flex items-center justify-between lg:justify-center"
        onClick={onLogoClick}
      >
        <img src="/OODC logo2.png" alt="OODC Logo" className="h-12 lg:h-16" />
        {jobTitle && (
          <span className="text-sm font-medium text-gray-900 lg:hidden">
            {jobTitle}
          </span>
        )}
      </div>

      <div className="flex-1">
        <ApplicationProgressSteps currentStage={currentStage} />
      </div>
    </div>
  );
};
