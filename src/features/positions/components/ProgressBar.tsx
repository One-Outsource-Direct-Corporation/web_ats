import React from "react";

export interface ProgressBarProps {
  progress: { completed: number; total: number };
  assignee: string;
}

const segmentColors = [
  "bg-blue-500",
  "bg-blue-600",
  "bg-blue-700",
  "bg-blue-800",
  "bg-blue-900",
];

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, assignee }) => {
  const numberOfSegments = progress.total;
  const totalWidth = 90;
  const segmentWidth = Math.floor(totalWidth / numberOfSegments);
  const lastCompletedIndex =
    progress.completed > 0 ? progress.completed - 1 : -1;

  return (
    <div className="flex flex-col items-end gap-1 mt-1">
      <span className="text-xs text-gray-500 font-medium">
        {progress.completed}/{progress.total} completed
      </span>
      <div
        className="flex bg-gray-200 rounded-full p-1 shadow-inner"
        style={{ width: `${totalWidth}px` }}
      >
        {Array.from({ length: numberOfSegments }, (_, index) => (
          <div
            key={index}
            className={`relative h-3 ${
              index < progress.completed ? segmentColors[index] : "bg-gray-300"
            } ${
              index === 0
                ? "rounded-l-full"
                : index === numberOfSegments - 1
                ? "rounded-r-full"
                : ""
            } ${
              index > 0 ? "ml-0.5" : ""
            } transition-all duration-300 ease-in-out ${
              index === lastCompletedIndex && index < progress.completed
                ? "group cursor-pointer"
                : ""
            }`}
            style={{ width: `${segmentWidth - (index > 0 ? 2 : 0)}px` }}
          >
            {index === lastCompletedIndex && index < progress.completed && (
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                {assignee}
                <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
