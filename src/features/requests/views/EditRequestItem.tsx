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
import PRF from "@/features/prf/views/PRF";
import type { PRFDb, PRFFormData } from "@/features/prf/types/prf.types";
import type { PositionDb } from "@/features/positions-client/types/create_position.types";
import PositionClient from "@/features/positions-client/views/PositionClient";

export default function EditRequestItem() {
  const { type, id } = useParams<{ type: "prf" | "position"; id: string }>();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const { position, loading, error, refetch } = usePositionDetail({
    id: id ? Number(id) : undefined,
    non_admin: false,
  });

  useEffect(() => {
    document.title =
      type === "prf" ? "Edit Internal" : "Edit Client" + " Position";
  }, [type]);

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
              Edit {type === "prf" ? "Internal" : "Client"} Position
            </h1>
            <p className="text-gray-600">
              {position.job_posting.job_title} • ID:{" "}
              {((position as PRFDb) || (position as PositionDb)).job_posting.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={
              ((position as PRFDb) || (position as PositionDb)).job_posting
                .status
            }
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
                ((position as PRFDb) || (position as PositionDb)).job_posting
                  .status
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
          {((position as PRFDb) || (position as PositionDb)).job_posting
            .status === "active" && (
            <Select
              value={(
                (position as PRFDb) || (position as PositionDb)
              ).job_posting.published.toString()}
              onValueChange={async (value: "true" | "false") => {
                try {
                  const endpoint =
                    type === "prf" ? `/api/prf/${id}/` : `/api/position/${id}/`;
                  const response = await axiosPrivate.patch(endpoint, {
                    job_posting: {
                      published: value === "true",
                      status: ((position as PRFDb) || (position as PositionDb))
                        .job_posting.status,
                    },
                  });
                  console.log(response);
                  refetch();
                  toast.success("Published status updated successfully");
                } catch (err: AxiosError | any) {
                  console.error("Error updating published status:", err);
                  toast.error(
                    err.response?.data?.detail ||
                      "Failed to update published status"
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
        {type === "prf" ? (
          <PRF initialData={position as PRFFormData} updateMode={true} />
        ) : (
          <PositionClient
            initialData={position as PositionDb}
            updateMode={true}
          />
        )}
      </div>
    </div>
  );
}
