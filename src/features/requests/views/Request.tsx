import type { PRFData } from "@/features/prf/types/prfTypes";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import { usePositions } from "@/shared/hooks/usePositions";
import formatDate from "@/shared/utils/formatDate";
import formatName, { formatNameBySpace } from "@/shared/utils/formatName";
import FilterBar from "../components/FilterBar";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useState, useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import { Ellipsis, SquarePen, Trash2 } from "lucide-react";
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

function getStatusColor(status: string) {
  switch (status) {
    case "draft":
      return "bg-green-100 text-green-800";
    case "closed":
      return "bg-red-100 text-red-800";
    case "cancelled":
      return "bg-gray-100 text-gray-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
}

type SelectedItem = {
  id: number;
  unique_id: string;
  type: "prf" | "position";
};

export default function Request() {
  const { positions, loading, error, refetch } = usePositions("no_active");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const selectAll =
    positions.length > 0 && selectedItems.length === positions.length;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  console.log(positions);

  // Handle select all checkbox
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allItems = positions.map((item) => ({
          id: item.id,
          unique_id: item.unique_id,
          type: item.type,
        }));
        setSelectedItems(allItems);
      } else {
        setSelectedItems([]);
      }
    },
    [positions]
  );

  // Handle individual checkbox
  const handleItemSelect = useCallback(
    (
      itemId: number,
      itemType: "prf" | "position",
      uniqueId: string,
      checked: boolean
    ) => {
      setSelectedItems((prev) => {
        if (checked) {
          return [...prev, { id: itemId, unique_id: uniqueId, type: itemType }];
        } else {
          return prev.filter((item) => item.unique_id !== uniqueId);
        }
      });
    },
    []
  );

  // Handle delete action
  const handleDelete = useCallback(async () => {
    if (selectedItems.length === 0) return;

    // Group items by type
    const prfIds = selectedItems
      .filter((item) => item.type === "prf")
      .map((item) => item.id);
    const positionIds = selectedItems
      .filter((item) => item.type === "position")
      .map((item) => item.id);

    try {
      const deletePromises = [];

      // Delete PRF items
      if (prfIds.length > 0) {
        const data = { ids: prfIds };
        deletePromises.push(
          axiosPrivate.delete("/api/prf/", {
            data,
          })
        );
      }

      // Delete Position items
      if (positionIds.length > 0) {
        const data = { ids: positionIds };
        console.log(data);
        deletePromises.push(
          axiosPrivate.delete("/api/job/", {
            data,
          })
        );
      }

      await Promise.all(deletePromises);

      // Show success message based on what was deleted
      if (prfIds.length > 0 && positionIds.length > 0) {
        toast.success("Successfully deleted PRF and Position items.");
      } else if (prfIds.length > 0) {
        toast.success("Successfully deleted PRF items.");
      } else if (positionIds.length > 0) {
        toast.success("Successfully deleted Position items.");
      }

      setSelectedItems([]);
      await refetch();
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.error("Failed to delete some items. Please try again.");
    }
  }, [selectedItems]);

  return (
    <section className="flex flex-col bg-gray-50">
      <div className="bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Request</h1>
            {selectedItems.length > 0 && (
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
          <FilterBar />
        </div>
      </div>

      {/* Main content section */}
      {loading && <LoadingComponent />}
      {!loading && (
        <div className="max-w-7xl mx-auto w-full mt-5 px-6">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-50 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-3 w-12">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3">Position Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Immediate Supervisor</th>
                <th className="px-4 py-3">Date Requested</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-center w-32">Pipeline</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr className="border-t">
                  <td
                    colSpan={8}
                    className="text-center text-red-500 px-4 py-3"
                  >
                    Something went wrong. Please try again later.
                  </td>
                </tr>
              )}
              {!loading && !error && positions.length === 0 && (
                <tr className="border-t">
                  <td
                    colSpan={8}
                    className="text-center text-gray-500 px-4 py-3"
                  >
                    This tab is empty.
                  </td>
                </tr>
              )}
              {!loading && !error && positions.length > 0 && (
                <>
                  {positions.map((item) => {
                    const itemType = item.type;
                    const uniqueId = item.unique_id;
                    const isSelected = selectedItems.some(
                      (selected) => selected.unique_id === item.unique_id
                    );

                    return (
                      <tr
                        key={item.unique_id}
                        className="border-t odd:bg-transparent even:bg-gray-50 hover:bg-gray-100"
                      >
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleItemSelect(
                                item.id,
                                itemType,
                                uniqueId,
                                checked as boolean
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {item.job_title}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 whitespace-nowrap rounded-full font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {formatName(item.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {(item as PRFData)?.immediate_supervisor ? (
                            <>
                              <div className="font-medium">
                                {formatNameBySpace(
                                  (item as PRFData).immediate_supervisor_display
                                )}
                              </div>
                              <div className="text-gray-500">
                                {formatName(item.department)}
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 whitespace-nowrap rounded-full font-medium ${
                              item.type === "prf"
                                ? "bg-green-100 text-green-700"
                                : "bg-neutral-700 text-neutral-100"
                            }`}
                          >
                            {item.type_display}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.status === "pending" ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            // Bring back when approval pipeline is available
                            // <ApprovalPipelineDropdown
                            //   pipeline={item.approvalPipeline}
                            // />
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 flex justify-center">
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
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
