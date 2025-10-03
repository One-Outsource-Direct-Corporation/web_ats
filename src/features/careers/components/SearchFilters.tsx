import { Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  workTypeFilter: string;
  onWorkTypeFilterChange: (value: string) => void;
  workSetupFilter: string;
  onWorkSetupFilterChange: (value: string) => void;
  onSearch: () => void;
  onClearFilters: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchTermChange,
  categoryFilter,
  onCategoryFilterChange,
  workTypeFilter,
  onWorkTypeFilterChange,
  workSetupFilter,
  onWorkSetupFilterChange,
  onSearch,
  onClearFilters,
}) => {
  return (
    <div className="mx-auto max-w-6xl mt-6 bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Input
              placeholder="Search jobs..."
              className="pr-10"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="min-w-[150px]">
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Entry-level">Entry-level</SelectItem>
              <SelectItem value="Mid-level">Mid-level</SelectItem>
              <SelectItem value="Senior-level">Senior-level</SelectItem>
              <SelectItem value="Executive/Management">
                Executive/Management
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[150px]">
          <Select value={workTypeFilter} onValueChange={onWorkTypeFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Work Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Work Types</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Freelance">Freelance</SelectItem>
              <SelectItem value="Temporary employment">
                Temporary employment
              </SelectItem>
              <SelectItem value="Internships">Internships</SelectItem>
              <SelectItem value="Apprenticeships">Apprenticeships</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[150px]">
          <Select
            value={workSetupFilter}
            onValueChange={onWorkSetupFilterChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Work Setup" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Work Setup</SelectItem>
              <SelectItem value="Onsite">Onsite</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            onClick={onSearch}
          >
            Search
          </Button>
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
