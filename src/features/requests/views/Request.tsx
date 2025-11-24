import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import { usePositions } from "@/shared/hooks/usePositions";
import { formatDate } from "@/shared/utils/formatDate";
import formatName from "@/shared/utils/formatName";
import FilterBar from "../components/FilterBar";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Ellipsis,
  SquarePen,
  Trash2,
  ChevronLeft,
  ChevronRight,
  EyeIcon,
} from "lucide-react";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { formatBackgroundStatus } from "@/shared/utils/formatBackgroundStatus";
import { ApprovalPipelineDropdown } from "../components/ApprovalPipelineDropdown";
import type { JobPostingDbWithApprovers } from "@/features/positions-client/types/create_position.types";

interface SelectedItem {
  id: number;
}

export default function Request({ manager = false }: { manager?: boolean }) {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    employment_type: "all",
    work_setup: "all",
    order_by: "desc",
  });
  const { positions, loading, error, refetch } = usePositions({
    my_postings: manager ? false : true,
    page: currentPage,
    type: filters.type,
    status: filters.status,
    employment_type: filters.employment_type,
    work_setup: filters.work_setup,
    order_by: filters.order_by,
    published: "",
  });
  const selectAll = positions
    ? positions.results.length > 0 &&
      selectedItems.length === positions.results.length
    : false;

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Requests - OODC ATS";
  }, []);

  // Handle select all checkbox
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allItems = positions
          ? positions.results.map((item) => ({
              id: item.id,
              type: item.type,
            }))
          : [];
        setSelectedItems(allItems);
      } else {
        setSelectedItems([]);
      }
    },
    [positions]
  );

  // Handle individual checkbox
  const handleItemSelect = useCallback((itemId: number, checked: boolean) => {
    setSelectedItems((prev) => {
      if (checked) {
        return [...prev, { id: itemId }];
      } else {
        return prev.filter((item) => item.id !== itemId);
      }
    });
  }, []);

  // Handle delete action
  const handleDelete = useCallback(async () => {
    if (selectedItems.length === 0) return;

    try {
      const ids = selectedItems.map((item) => item.id);
      const data = { ids };

      await axiosPrivate.delete("/api/job/bulk-delete/", {
        data,
      });

      toast.success(`Successfully deleted ${ids.length} item(s)`);
      setSelectedItems([]);

      // Check if current page will be empty after deletion
      const remainingItemsOnCurrentPage = positions.results.filter(
        (item) => !ids.includes(item.id)
      );

      if (remainingItemsOnCurrentPage.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await refetch();
      }
    } catch (error: any) {
      console.error("Error deleting items:", error);
      toast.error(
        error?.response?.data?.detail ||
          "Failed to delete some items. Please try again."
      );
    }
  }, [selectedItems, currentPage, positions.results, axiosPrivate, refetch]);

  // Handle page change
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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Request</h1>
            {!manager && selectedItems.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedItems.length})
              </Button>
            )}
          </div>
          <p className="text-lg text-gray-700">
            Handles hiring requests and approvals
          </p>
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>
      </div>

      {/* Main content section */}
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="max-w-7xl mx-auto w-full mt-5 px-6">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-50 text-gray-700 text-left">
              <tr>
                {!manager && (
                  <th className="px-4 py-3 w-12">
                    <Checkbox
                      className="data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                )}
                <th className="px-4 py-3">Position Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date Requested</th>
                <th className="px-4 py-3">Target Start Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-center w-32">Pipeline</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr className="border-t">
                  <td
                    colSpan={manager ? 7 : 8}
                    className="text-center text-red-500 px-4 py-3"
                  >
                    {error}
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                positions &&
                positions.results.length === 0 && (
                  <tr className="border-t">
                    <td
                      colSpan={manager ? 7 : 8}
                      className="text-center text-gray-500 px-4 py-3"
                    >
                      This tab is empty.
                    </td>
                  </tr>
                )}
              {positions && positions.results.length > 0 && (
                <>
                  {positions.results.map((item) => {
                    const isSelected = selectedItems.some(
                      (selected) => selected.id === item.id
                    );

                    return (
                      <tr
                        key={item.id}
                        className="border-t odd:bg-transparent even:bg-gray-50 hover:bg-gray-100"
                      >
                        {!manager && (
                          <td className="px-4 py-3">
                            <Checkbox
                              className="data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleItemSelect(item.id, checked as boolean)
                              }
                            />
                          </td>
                        )}
                        <td className="px-4 py-3 font-medium">
                          {item.job_title}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 whitespace-nowrap rounded-full font-medium ${formatBackgroundStatus(
                              item.status
                            )}`}
                          >
                            {formatName(item.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(item.created_at, true)}
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(item.target_start_date, true)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 whitespace-nowrap rounded-full font-medium ${
                              item.type === "prf"
                                ? "bg-green-100 text-green-700"
                                : "bg-neutral-700 text-neutral-100"
                            }`}
                          >
                            {item.type_display === "PRF"
                              ? "Internal"
                              : "Client"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.type === "prf" ? (
                            (item as JobPostingDbWithApprovers)
                              .approving_managers &&
                            (item as JobPostingDbWithApprovers)
                              .approving_managers.length > 0 ? (
                              <ApprovalPipelineDropdown
                                approvers={
                                  (item as JobPostingDbWithApprovers)
                                    .approving_managers
                                }
                              />
                            ) : (
                              <span className="text-gray-500 text-xs">
                                No Approver
                              </span>
                            )
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 flex justify-center">
                          {manager ? (
                            item.type === "prf" ? (
                              <EyeIcon
                                className="h-4 w-4 cursor-pointer text-neutral-600 hover:text-neutral-900"
                                onClick={() =>
                                  navigate(`/requests/manager/${item.id}`)
                                }
                              />
                            ) : (
                              <span className="text-gray-400">—</span>
                            )
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Ellipsis
                                  size={32}
                                  className="hover:bg-neutral-100 p-2 rounded-lg cursor-pointer"
                                />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                className="w-12 text-neutral-600"
                                align="start"
                              >
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() =>
                                      navigate(
                                        `/requests/edit/${item.type}/${item.id}`
                                      )
                                    }
                                  >
                                    <SquarePen className="h-4 w-4" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
          {/* Pagination */}
        </div>
      )}
      {positions && positions.results.length > 0 && (
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
    </section>
  );
}
