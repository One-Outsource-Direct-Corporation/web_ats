import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.tsx";

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  selectedOffice: string;
  setSelectedOffice: (val: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (val: string) => void;
  selectedEmploymentType: string;
  setSelectedEmploymentType: (val: string) => void;
  onAddNewPosition: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  setSearch,
  selectedOffice,
  setSelectedOffice,
  selectedDepartment,
  setSelectedDepartment,
  selectedEmploymentType,
  setSelectedEmploymentType,
  onAddNewPosition,
}) => (
  <div className="flex flex-wrap justify-between items-center gap-4">
    <Input
      placeholder="Search positions..."
      className="w-64"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <div className="flex flex-wrap gap-2 ml-auto">
      <Select value={selectedOffice} onValueChange={setSelectedOffice}>
        <SelectTrigger className="min-w-[160px] bg-gray-100">
          <SelectValue placeholder="All Offices" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Offices</SelectItem>
        </SelectContent>
      </Select>
      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
        <SelectTrigger className="min-w-[160px] bg-gray-100">
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={selectedEmploymentType}
        onValueChange={setSelectedEmploymentType}
      >
        <SelectTrigger className="min-w-[160px] bg-gray-100">
          <SelectValue placeholder="All Employment Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Employment Type</SelectItem>
        </SelectContent>
      </Select>
      <button
        className="w-full sm:w-auto bg-transparent border px-4 py-2 rounded"
        onClick={onAddNewPosition}
      >
        Add New Position
      </button>
    </div>
  </div>
);

export default FilterBar;
