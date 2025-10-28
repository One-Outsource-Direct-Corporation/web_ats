interface ApplicationProgressStepsProps {
  currentStage: number;
}

const steps = [
  { step: 1, title: "Applicant Information" },
  { step: 2, title: "Job Details" },
  { step: 3, title: "Work and Education" },
  { step: 4, title: "Acknowledgement" },
];

export const ApplicationProgressSteps = ({
  currentStage,
}: ApplicationProgressStepsProps) => {
  return (
    <div className="w-full">
      {/* Mobile & Tablet: Horizontal Layout */}
      <div className="flex lg:hidden px-2 items-start">
        {steps.map(({ step, title }, index) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              <div
                className="h-0.5 bg-gray-300 flex-1"
                style={{ visibility: index === 0 ? "hidden" : "visible" }}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                  currentStage >= step
                    ? "bg-blue-600 text-white"
                    : "border-2 border-gray-300 text-gray-400"
                }`}
              >
                {step}
              </div>
              <div
                className="h-0.5 bg-gray-300 flex-1"
                style={{
                  visibility: index === steps.length - 1 ? "hidden" : "visible",
                }}
              ></div>
            </div>
            <span
              className={`text-xs mt-2 text-center px-1 ${
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

      {/* Desktop: Vertical Layout */}
      <div className="hidden lg:block">
        {steps.map(({ step, title }, index) => (
          <div key={step}>
            <div className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                    currentStage >= step
                      ? "bg-blue-600 text-white"
                      : "border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-300"></div>
                )}
              </div>
              <span
                className={`text-sm pt-1 ${
                  currentStage >= step
                    ? "text-gray-900 font-medium"
                    : "text-gray-400"
                }`}
              >
                {title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
