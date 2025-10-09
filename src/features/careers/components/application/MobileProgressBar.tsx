const steps = [
  { step: 1, title: "Applicant Information" },
  { step: 2, title: "Job Details" },
  { step: 3, title: "Work and Education" },
  { step: 4, title: "Acknowledgement" },
];

interface MobileProgressBarProps {
  currentStage: number;
  jobTitle: string;
  onLogoClick: () => void;
}

export const MobileProgressBar: React.FC<MobileProgressBarProps> = ({
  currentStage,
  jobTitle,
  onLogoClick,
}) => {
  return (
    <div className="lg:hidden sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        {/* Logo */}
        <img
          src="/OODC logo2.png"
          alt="OODC Logo"
          className="h-12 cursor-pointer"
          onClick={onLogoClick}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{jobTitle}</span>
        </div>
      </div>

      {/* Mobile Progress Steps - Vertical Layout */}
      <div className="space-y-3">
        {steps.map(({ step, title }) => (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                currentStage >= step
                  ? "bg-blue-600 text-white"
                  : currentStage === step
                  ? "border-2 border-blue-600 bg-white text-blue-600"
                  : "border-2 border-gray-300 text-gray-400"
              }`}
            >
              {currentStage > step ? "✓" : step}
            </div>
            <span
              className={`text-sm ${
                currentStage >= step
                  ? "text-gray-900 font-medium"
                  : "text-gray-400"
              }`}
            >
              {title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
