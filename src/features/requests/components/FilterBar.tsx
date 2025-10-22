import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select.tsx";
function FilterBar({
  filters,
  setFilters,
}: {
  filters: {
    type: string;
    status: string;
    employment_type: string;
    work_setup: string;
    order_by: string;
  };
  setFilters: (filters: {
    type: string;
    status: string;
    employment_type: string;
    work_setup: string;
    order_by: string;
  }) => void;
}) {
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
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="prf">Internal</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              status: value,
            })
          }
        >
          <SelectTrigger className="min-w-[160px] bg-gray-100">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.employment_type}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              employment_type: value,
            })
          }
        >
          <SelectTrigger className="min-w-[160px] bg-gray-100">
            <SelectValue placeholder="Employment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employment Types</SelectItem>
            <SelectItem value="full_time">Full Time</SelectItem>
            <SelectItem value="part_time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="temporary">Temporary</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.work_setup}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              work_setup: value,
            })
          }
        >
          <SelectTrigger className="min-w-[160px] bg-gray-100">
            <SelectValue placeholder="Work Setup" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Work Setups</SelectItem>
            <SelectItem value="onsite">Onsite</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.order_by}
          onValueChange={(value) => {
            setFilters({
              ...filters,
              order_by: value,
            });
          }}
        >
          <SelectTrigger className="min-w-[160px] bg-gray-100">
            <SelectValue placeholder="Order By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Latest To Oldest</SelectItem>
            <SelectItem value="asc">Oldest To Latest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default FilterBar;
