import { useState } from "react";
import type { JobFilters } from "../types/job.types";

export const useJobFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [workTypeFilter, setWorkTypeFilter] = useState("All");
  const [workSetupFilter, setWorkSetupFilter] = useState("All");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearch = () => {
    setIsSearchActive(true);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setWorkTypeFilter("All");
    setWorkSetupFilter("All");
    setIsSearchActive(false);
  };

  const filters: JobFilters = {
    searchTerm,
    categoryFilter,
    workTypeFilter,
    workSetupFilter,
  };

  return {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    workTypeFilter,
    setWorkTypeFilter,
    workSetupFilter,
    setWorkSetupFilter,
    isSearchActive,
    setIsSearchActive,
    filters,
    handleSearch,
    handleClearFilters,
  };
};
