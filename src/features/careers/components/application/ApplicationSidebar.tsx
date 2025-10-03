import { ApplicationProgressSteps } from "./ApplicationProgressSteps";

interface ApplicationSidebarProps {
  currentStage: number;
  onLogoClick: () => void;
}

export const ApplicationSidebar: React.FC<ApplicationSidebarProps> = ({
  currentStage,
  onLogoClick,
}) => {
  return (
    <div className="hidden lg:flex w-80 bg-white shadow-lg p-6 flex-col sticky top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="mb-8 cursor-pointer" onClick={onLogoClick}>
        <img src="/OODC logo2.png" alt="OODC Logo" className="h-16 mx-auto" />
      </div>

      {/* Progress Steps */}
      <div className="flex-1">
        <ApplicationProgressSteps currentStage={currentStage} />
      </div>
    </div>
  );
};
