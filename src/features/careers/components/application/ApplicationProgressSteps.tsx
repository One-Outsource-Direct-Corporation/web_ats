interface ApplicationProgressStepsProps {
  currentStage: number;
}

const steps = [
  { step: 1, title: "Applicant Information" },
  { step: 2, title: "Job Details" },
  { step: 3, title: "Work and Education" },
  { step: 4, title: "Acknowledgement" },
];

export const ApplicationProgressSteps: React.FC<
  ApplicationProgressStepsProps
> = ({ currentStage }) => {
  return (
    <div className="space-y-6">
      {steps.map(({ step, title }, index) => (
        <div key={step}>
          <div className="flex items-center gap-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStage >= step
                  ? "bg-blue-600 text-white"
                  : "border-2 border-gray-300 text-gray-400"
              }`}
            >
              {step}
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
          {index < steps.length - 1 && (
            <div className="ml-4 w-0.5 h-8 bg-gray-200"></div>
          )}
        </div>
      ))}
    </div>
  );
};
