import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { CheckCircle, Clock } from "lucide-react";
import type { ApproverDb } from "@/features/positions-client/types/create_position.types";
import formatName from "@/shared/utils/formatName";

interface ApprovalPipelineDropdownProps {
  approvers: ApproverDb[];
}

export function ApprovalPipelineDropdown({
  approvers,
}: ApprovalPipelineDropdownProps) {
  if (approvers.length === 0) {
    return <span className="text-gray-500 text-xs">No Approver</span>;
  }

  const approvedCount = approvers.filter(
    (a) => a.status.toLowerCase() === "approved"
  ).length;
  const pendingCount = approvers.filter(
    (a) => a.status.toLowerCase() === "pending"
  ).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-blue-600 hover:underline text-xs font-medium cursor-pointer">
          View Pipeline
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="center">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">Approval Pipeline</h3>
          </div>
          <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
            {approvers.map((approver) => {
              const isApproved = approver.status.toLowerCase() === "approved";
              const isPending = approver.status.toLowerCase() === "pending";
              const isRejected = approver.status.toLowerCase() === "rejected";

              return (
                <div
                  key={approver.id}
                  className="flex items-start gap-2 text-sm"
                >
                  {isApproved && (
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  )}
                  {isPending && (
                    <Clock className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  )}
                  {isRejected && (
                    <div className="h-4 w-4 rounded-full bg-red-600 mt-0.5 flex-shrink-0 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✕</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        isApproved
                          ? "text-green-700"
                          : isPending
                          ? "text-orange-600"
                          : "text-red-700"
                      }`}
                    >
                      {isApproved && "Approved by "}
                      {isPending && "Pending Approval by "}
                      {isRejected && "Rejected by "}
                      {approver.approving_manager.full_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatName(approver.approving_manager.role)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {(approvedCount > 0 || pendingCount > 0) && (
            <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-600">
              {approvedCount > 0 && (
                <span className="mr-3">✓ {approvedCount} Approved</span>
              )}
              {pendingCount > 0 && <span>⏱ {pendingCount} Pending</span>}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
