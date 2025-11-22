import type { ApproverDb } from "@/features/positions-client/types/create_position.types";
import formatMoney from "@/shared/utils/formatMoney";
import type { PRFFormData } from "../types/prf.types";
import formatName from "@/shared/utils/formatName";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ApproverProps {
  approvers: ApproverDb[];
  formData: PRFFormData;
}

const getStatusButton = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return (
        <button className="text-green-600 bg-green-100 px-3 py-1 text-xs rounded cursor-default">
          Approved
        </button>
      );
    case "rejected":
      return (
        <button className="text-red-600 bg-red-100 px-3 py-1 text-xs rounded cursor-default">
          Rejected
        </button>
      );
    case "pending":
    default:
      return (
        <div className="flex gap-2">
          <button className="text-red-600 bg-red-100 px-3 py-1 text-xs rounded hover:bg-red-200">
            Reject
          </button>
          <button className="text-green-600 bg-green-100 px-3 py-1 text-xs rounded hover:bg-green-200">
            Approve
          </button>
        </div>
      );
  }
};

export default function Approver({ approvers, formData }: ApproverProps) {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      {approvers.map((approver, index) => {
        const isLast = index === approvers.length - 1;

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
                className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  approver.status.toLowerCase() === "approved"
                    ? "bg-green-600 text-white"
                    : approver.status.toLowerCase() === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {index + 1}
              </div>
            </div>
            {/* Right Content */}
            <div className="border rounded-lg p-4 bg-white shadow space-y-4 flex-1">
              {/* Header with title & buttons */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">
                    {formatName(approver.approving_manager.role)} Review
                  </p>
                  <p className="text-xs text-gray-500">
                    Status: {approver.status}
                  </p>
                </div>
                {approver.approving_manager.id === user?.id &&
                  getStatusButton(approver.status)}
              </div>
              {/* Approver */}
              <p className="text-sm text-gray-500">
                <strong>{formatName(approver.approving_manager.role)}:</strong>{" "}
                {approver.approving_manager.full_name}
              </p>
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
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-500 bg-white"
                />
              </div>
              {/* Comments */}
              <div>
                <label className="text-sm font-semibold block mb-1">
                  Comments
                </label>
                <textarea
                  rows={4}
                  disabled={approver.status.toLowerCase() !== "pending"}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 bg-white resize-none"
                  value={approver.comment ?? ""}
                  placeholder="No comment"
                  readOnly={approver.approving_manager.id !== user?.id}
                />
              </div>
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
