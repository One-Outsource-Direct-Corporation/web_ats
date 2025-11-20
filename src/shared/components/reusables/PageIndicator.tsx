import type { JobPostingAPIResponse } from "@/features/positions-client/types/create_position.types";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageIndicator {
  // loading: boolean;
  // error: any;
  positions: JobPostingAPIResponse | null;
  currentPage: number;
  // onPageChange: (newPage: number) => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}

export default function PageIndicator({
  positions,
  currentPage,
  handlePrevPage,
  handleNextPage,
}: PageIndicator) {
  return (
    <div className="flex justify-center items-center mt-4 space-x-4">
      {positions && (
        <>
          <Button
            variant="ghost"
            onClick={handlePrevPage}
            disabled={!positions.previous}
            className="text-gray-600 hover:bg-gray-900 hover:text-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-50 rounded-md bg-gray-900 p-2 px-4">
            {currentPage}
          </span>
          <Button
            variant="ghost"
            onClick={handleNextPage}
            disabled={!positions.next}
            className="text-gray-600 hover:bg-gray-900 hover:text-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
