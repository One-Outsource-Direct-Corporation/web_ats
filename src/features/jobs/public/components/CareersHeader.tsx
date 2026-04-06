import { Button } from "@/shared/components/ui/button";

interface CareersHeaderProps {
  onTrackApplication: () => void;
}

export const CareersHeader: React.FC<CareersHeaderProps> = ({
  onTrackApplication,
}) => {
  return (
    <header className="w-full mt-0 p-4 flex items-center justify-between bg-white shadow-md rounded-b-2xl">
      <div className="flex items-center gap-4 ml-6">
        <div className="text-2xl font-bold text-blue-600">
          <img
            src="/OODC%20logo2.png"
            alt="OODC Logo"
            className="h-24 mx-auto"
          />
        </div>
      </div>
      <Button
        onClick={onTrackApplication}
        className="border-2 border-blue-500 bg-white text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200 mr-6"
      >
        Track Application
      </Button>
    </header>
  );
};
