import type { ApproverDb } from "@/features/positions-client/types/create_position.types";
import formatMoney from "@/shared/utils/formatMoney";
import type { PRFDb, PRFFormData } from "../types/prf.types";
import formatName from "@/shared/utils/formatName";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { toast } from "react-toastify";

interface ApproverProps {
  approvers: ApproverDb[];
  formData: PRFFormData;
  onUpdate?: () => void;
}

interface ApproverState {
  status: string;
  comment: string;
}

export default function Approver({
  approvers,
  formData,
  onUpdate,
}: ApproverProps) {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [approverStates, setApproverStates] = useState<
    Record<number, ApproverState>
  >(
    approvers.reduce(
      (acc, approver) => ({
        ...acc,
        [approver.id]: {
          status: approver.status,
          comment: approver.comment || "",
        },
      }),
      {}
    )
  );

  const [updatingApprovers, setUpdatingApprovers] = useState<Set<number>>(
    new Set()
  );

  const handleStatusChange = (approverId: number, status: string) => {
    setApproverStates((prev) => ({
      ...prev,
      [approverId]: {
        ...prev[approverId],
        status,
      },
    }));
  };

  const handleCommentChange = (approverId: number, comment: string) => {
    setApproverStates((prev) => ({
      ...prev,
      [approverId]: {
        ...prev[approverId],
        comment,
      },
    }));
  };

  const handleUpdateApproval = async (approverId: number) => {
    try {
      setUpdatingApprovers((prev) => new Set(prev).add(approverId));

      const state = approverStates[approverId];
      await axiosPrivate.patch(
        `/api/prf/approval/${(formData as PRFDb).job_posting.id}/`,
        {
          approver_id: approverId,
          status: state.status,
          comment: state.comment,
        }
      );

      toast.success("Approval updated successfully");
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error("Error updating approval:", error);
      toast.error(error?.response?.data?.detail || "Failed to update approval");
    } finally {
      setUpdatingApprovers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(approverId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-600 text-white";
      case "rejected":
        return "bg-red-600 text-white";
      case "pending":
      default:
        return "bg-blue-600 text-white";
    }
  };

  const hasChanges = (approverId: number) => {
    const approver = approvers.find((a) => a.id === approverId);
    const state = approverStates[approverId];
    if (!approver || !state) return false;

    return (
      approver.status !== state.status ||
      (approver.comment || "") !== state.comment
    );
  };
  return (
    <div className="space-y-6">
      {approvers.map((approver, index) => {
        const isLast = index === approvers.length - 1;
        const state = approverStates[approver.id];
        const isCurrentUser = approver.approving_manager.id === user?.id;
        const isUpdating = updatingApprovers.has(approver.id);
        const canUpdate = isCurrentUser && hasChanges(approver.id);

        return (
          <div key={approver.id} className="relative flex gap-4">
            {/* Left Timeline */}
            <div className="flex flex-col items-center w-6">
              {/* Line */}
              {!isLast && (
                <div className="absolute top-6 left-[11px] h-full w-px bg-blue-200 z-0" />
              )}
              {/* Circle */}
              <div
                className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getStatusColor(
                  state?.status || approver.status
                )}`}
              >
                {index + 1}
              </div>
            </div>
            {/* Right Content */}
            <div className="border rounded-lg p-4 bg-white shadow space-y-4 flex-1">
              {/* Header with title & status dropdown */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {formatName(approver.approving_manager.role)} Review
                  </p>
                  <p className="text-xs text-gray-500">
                    Approver: {approver.approving_manager.full_name}
                  </p>
                </div>
                {isCurrentUser && (
                  <div className="flex flex-col gap-2">
                    <Select
                      value={state?.status}
                      onValueChange={(value) =>
                        handleStatusChange(approver.id, value)
                      }
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {!isCurrentUser && (
                  <span
                    className={`px-3 py-1 text-xs rounded font-medium ${
                      state?.status.toLowerCase() === "approved"
                        ? "bg-green-100 text-green-700"
                        : state?.status.toLowerCase() === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {formatName(state?.status || approver.status)}
                  </span>
                )}
              </div>

              {/* Budget Allocation */}
              <div>
                <label className="text-sm font-semibold block mb-1">
                  Budget Allocation
                </label>
                <input
                  type="text"
                  value={
                    formData.job_posting.min_salary &&
                    formData.job_posting.max_salary
                      ? `${formatMoney(
                          formData.job_posting.min_salary
                        )} - ${formatMoney(formData.job_posting.max_salary)}`
                      : "No budget allocated"
                  }
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 bg-gray-50"
                />
              </div>

              {/* Comments */}
              <div>
                <label className="text-sm font-semibold block mb-1">
                  Comments
                </label>
                <Textarea
                  rows={4}
                  disabled={!isCurrentUser}
                  className="w-full text-sm resize-none"
                  value={state?.comment || ""}
                  onChange={(e) =>
                    handleCommentChange(approver.id, e.target.value)
                  }
                  placeholder={
                    isCurrentUser ? "Add your comments here..." : "No comment"
                  }
                />
              </div>

              {/* Update Button */}
              {isCurrentUser && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleUpdateApproval(approver.id)}
                    disabled={!canUpdate || isUpdating}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    {isUpdating ? "Updating..." : "Update Approval"}
                  </Button>
                </div>
              )}

              {/* Timestamps */}
              {approver.status.toLowerCase() !== "pending" && (
                <div className="text-xs text-gray-400">
                  <p>
                    Updated: {new Date(approver.updated_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
