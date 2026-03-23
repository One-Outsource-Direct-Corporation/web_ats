import { useAppNavigation } from "@/shared/hooks/use-navigation";
import { CareersHeader } from "../components/CareersHeader";
import { JobOpeningPill } from "../components/JobOpeningPill";
import { SearchFilters } from "../components/SearchFilters";
import { JobList } from "../components/JobList";
import { CareersFooter } from "../components/CareersFooter";
import { useJobFilters } from "../hooks/useJobFilters";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import { usePositions } from "@/shared/hooks/usePositions";
import { useEffect } from "react";

export default function CareersLandingPage() {
  const navigation = useAppNavigation();
  const {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    workTypeFilter,
    setWorkTypeFilter,
    workSetupFilter,
    setWorkSetupFilter,
    handleSearch,
    handleClearFilters,
  } = useJobFilters();

  useEffect(() => {
    document.title = "Careers";
  }, []);

  const handleTrackApplication = () => {
    navigation.goToTracker();
  };

  const { positions, loading, error } = usePositions({
    non_admin: true,
  });

  let content = null;

  if (loading) {
    content = <LoadingComponent />;
  }

  if (error) {
    content = (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (positions && !loading && !error) {
    content = (
      <JobList
        jobs={
          positions || { count: 0, next: null, previous: null, results: [] }
        }
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <CareersHeader onTrackApplication={handleTrackApplication} />

        {/* Middle Content Container with Job Opening Pill */}
        <div className="relative flex-1">
          {/* Job Openings Pill - Left Side of Middle Content */}
          <JobOpeningPill />

          {/* Search & Filters */}
          <SearchFilters
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            workTypeFilter={workTypeFilter}
            onWorkTypeFilterChange={setWorkTypeFilter}
            workSetupFilter={workSetupFilter}
            onWorkSetupFilterChange={setWorkSetupFilter}
            onSearch={handleSearch}
            onClearFilters={handleClearFilters}
          />

          {/* Job Cards */}
          {content}
        </div>

        {/* Footer */}
        <CareersFooter />
      </div>
    </div>
  );
}
