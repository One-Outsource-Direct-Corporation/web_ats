import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import PRFEditForm from "../components/PRFEditForm";
import type { AxiosError } from "axios";
import { formatBackgroundStatus } from "@/shared/utils/formatBackgroundStatus";
import type {
  JobPostingResponsePosition,
  JobPostingResponsePRF,
} from "@/features/jobs/types/jobTypes";
import { usePositionDetail } from "@/shared/hooks/usePositions";
import PositionEditForm from "../components/PositionEditForm";

export default function EditRequestItem() {
  const { type, id } = useParams<{ type: "prf" | "position"; id: string }>();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const { position, loading, error, refetch } = usePositionDetail({
    id: id ? Number(id) : undefined,
    non_admin: false,
  });

  if (!position || loading) {
    return <LoadingComponent message="Loading Data" />;
  }

  if (error || !type) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || "Item not found"}</p>
          <Button onClick={() => navigate("/requests")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Requests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="gap-4">
          <Button
            onClick={() => navigate("/requests")}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Edit {type === "prf" ? "PRF" : "Position"}
            </h1>
            <p className="text-gray-600">
              {position.job_title} • ID: {position.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={position.status}
            onValueChange={async (
              value: "draft" | "pending" | "active" | "closed" | "cancelled"
            ) => {
              try {
                const endpoint =
                  type === "prf" ? `/api/prf/${id}/` : `/api/position/${id}/`;
                await axiosPrivate.patch(endpoint, {
                  job_posting: { status: value },
                });
                refetch(); // Refetch to update the position data
                toast.success("Status updated successfully");
              } catch (err: AxiosError | any) {
                console.error("Error updating status:", err);
                toast.error(
                  err.response?.data?.detail || "Failed to update status"
                );
              }
            }}
          >
            <SelectTrigger
              className={`w-32 rounded-4xl border-0 font-semibold ${formatBackgroundStatus(
                position.status
              )}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {type === "prf" ? (
          <PRFEditForm initialData={position as JobPostingResponsePRF} />
        ) : (
          <PositionEditForm
            initialData={position as JobPostingResponsePosition}
          />
        )}
      </div>
    </div>
  );
}
