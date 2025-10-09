export const JobOpeningPill: React.FC = () => {
  return (
    <div className="absolute top-1/2 transform -translate-y-70 z-30">
      <div
        className="bg-blue-600 rounded-br-2xl rounded-tr-2xl flex items-center justify-center shadow-lg"
        style={{ padding: "5px", height: "160px", width: "40px" }}
      >
        <div className="transform rotate-90 whitespace-nowrap">
          <span className="text-white font-bold text-xl tracking-wider">
            JOB OPENING
          </span>
        </div>
      </div>
    </div>
  );
};
