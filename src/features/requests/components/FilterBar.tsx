import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select.tsx";
function FilterBar() {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <Input placeholder="Search positions..." className="w-64" />
      <div className="flex flex-wrap gap-2 ml-auto">
        <Select>
          <SelectTrigger className="min-w-[160px] bg-gray-100">
            <SelectValue placeholder="All Offices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Offices</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="min-w-[160px] bg-gray-100">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="min-w-[160px] bg-gray-100">
            <SelectValue placeholder="All Employment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employment Type</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default FilterBar;
