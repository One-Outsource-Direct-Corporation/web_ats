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
import type { AxiosError } from "axios";
import { formatBackgroundStatus } from "@/shared/utils/formatBackgroundStatus";
import { usePositionDetail } from "@/shared/hooks/usePositions";
import { useEffect } from "react";
import PRFCreation from "@/Pages/PRFCreation";
import type {
  PRFFormData,
  PRFResponse,
} from "@/features/prf_2/types/LegacyPRFCompat";
import type {
  PositionResponse,
  PositionFormData,
} from "@/features/external_posting";
import ExternalPostingForm from "@/Pages/ExternalPostingForm";

type EditablePosition = PRFResponse | PositionResponse;

const isPrfResponse = (value: EditablePosition): value is PRFResponse =>
  "approval_status" in value;

const getAxiosErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  const axiosError = error as AxiosError<{
    detail?: string;
    error?: string;
    status?: string;
  }>;

  return (
    axiosError.response?.data?.detail ||
    axiosError.response?.data?.error ||
    axiosError.response?.data?.status ||
    fallbackMessage
  );
};

export default function EditRequestItem() {
  const { type, id } = useParams<{ type: "prf" | "position"; id: string }>();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const { position, loading, error, refetch } = usePositionDetail({
    id: id ? Number(id) : undefined,
    non_admin: false,
    requestType: type,
  });

  useEffect(() => {
    document.title =
      type === "prf" ? "Edit Internal" : "Edit Client" + " Position";
  }, [type]);

  if (loading) {
    return <LoadingComponent message="Loading Data" />;
  }

  if (error || !position || !type) {
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

  const editablePosition = position as EditablePosition;
  const jobPosting = editablePosition.job_posting;
  const isPrf =
    type === "prf" ||
    jobPosting.type === "prf" ||
    isPrfResponse(editablePosition);
  const prfPosition = isPrfResponse(editablePosition) ? editablePosition : null;

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
              Edit {isPrf ? "Internal" : "Client"} Position
            </h1>
            <p className="text-gray-600">
              {position.job_posting.job_title} • ID: {jobPosting.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPrf &&
            prfPosition?.approval_status?.is_fully_approved &&
            jobPosting.status !== "active" && (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                Ready to Activate
              </span>
            )}
          <Select
            value={jobPosting.status}
            onValueChange={async (
              value: "draft" | "pending" | "active" | "closed" | "cancelled",
            ) => {
              try {
                const endpoint = isPrf
                  ? `/api/prf/${id}/`
                  : `/api/external_posting/${id}/`;
                await axiosPrivate.patch(endpoint, {
                  job_posting: { status: value },
                });
                refetch();
                toast.success("Status updated successfully");
              } catch (err: unknown) {
                console.error("Error updating status:", err);
                toast.error(
                  getAxiosErrorMessage(err, "Failed to update status"),
                );
              }
            }}
          >
            <SelectTrigger
              className={`w-32 rounded-4xl border-0 font-semibold ${formatBackgroundStatus(
                jobPosting.status,
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
          {jobPosting.status === "active" && (
            <Select
              value={jobPosting.published.toString()}
              onValueChange={async (value: "true" | "false") => {
                try {
                  const endpoint = isPrf
                    ? `/api/prf/${id}/`
                    : `/api/external_posting/${id}/`;
                  const response = await axiosPrivate.patch(endpoint, {
                    job_posting: {
                      published: value === "true",
                      status: jobPosting.status,
                    },
                  });
                  console.log(response);
                  refetch();
                  toast.success("Published status updated successfully");
                } catch (err: unknown) {
                  console.error("Error updating published status:", err);
                  toast.error(
                    getAxiosErrorMessage(
                      err,
                      "Failed to update published status",
                    ),
                  );
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Published" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Unpublished</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {isPrf ? (
          <PRFCreation
            initialData={editablePosition as PRFFormData}
            updateMode={true}
          />
        ) : (
          <ExternalPostingForm
            initialData={editablePosition as PositionFormData}
            updateMode={true}
          />
        )}
      </div>
    </div>
  );
}
