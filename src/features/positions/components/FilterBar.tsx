import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select.tsx";

interface FilterBarProps {
  filters: {
    type: string;
    published: string;
  };
  setFilters: (filters: { type: string; published: string }) => void;
}

function FilterBar({ filters, setFilters }: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <Input placeholder="Search positions..." className="w-64" />
      <div className="flex flex-wrap gap-2 ml-auto">
        <Select
          value={filters.type}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              type: value,
            })
          }
        >
          <SelectTrigger className="min-w-[160px] bg-gray-100">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="prf">Internal</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.published}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              published: value,
            })
          }
        >
          <SelectTrigger className="min-w-[160px] bg-gray-100">
            <SelectValue placeholder="All Published" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Published</SelectItem>
            <SelectItem value="true">Published</SelectItem>
            <SelectItem value="false">Unpublished</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default FilterBar;
