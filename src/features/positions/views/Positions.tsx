import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import FilterBar from "../components/FilterBar";
import JobListItem from "../components/JobListItem";
import { usePositions } from "../../../shared/hooks/usePositions";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function Positions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    type: string;
    published: string;
  }>({
    type: "all",
    published: "all",
  });
  const { positions, loading, error, refetch } = usePositions({
    status: "active",
    page: currentPage,
    my_postings: true,
    type: filters.type,
    published: filters.published,
  });

  useEffect(() => {
    document.title = "Positions - OODC ATS";
  }, []);

  const handleNextPage = useCallback(() => {
    if (positions?.next) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [positions?.next]);

  const handlePrevPage = useCallback(() => {
    if (positions?.previous) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [positions?.previous]);

  return (
    <section className="flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
        <div className="max-w-7xl mx-auto space-y-3">
          <h1 className="text-3xl font-bold text-gray-800">Positions</h1>
          <p className="text-lg text-gray-700">
            Manages job openings and related information
          </p>
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>
      </div>

      {/* Main content section */}
      {loading && <LoadingComponent />}
      <div className="max-w-7xl mx-auto w-full mt-5 px-6">
        {error && (
          <div className="text-red-600 text-center">
            Error loading positions
          </div>
        )}
        {!loading && !error && positions && positions.results.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            This tab is empty.
          </div>
        )}
        {!loading && !error && positions && positions.results.length > 0 && (
          <div className="space-y-2">
            {positions.results.map((position) => (
              <JobListItem
                key={position.id}
                posting={position}
                refetch={refetch}
              />
            ))}
          </div>
        )}
        {/* Pagination */}
        {!loading && !error && positions && positions.results.length > 0 && (
          <div className="flex justify-center items-center mt-4 space-x-4">
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
          </div>
        )}
      </div>
    </section>
  );
}
