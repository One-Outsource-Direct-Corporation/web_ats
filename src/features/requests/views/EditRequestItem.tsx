import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { Button } from "@/shared/components/ui/button";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import type { PRFData } from "@/features/prf/types/prfTypes";
import type { PositionData } from "@/features/positions/types/positionTypes";
import PRFEditForm from "../components/PRFEditForm";
import PositionEditForm from "../components/PositionEditForm";

type EditItem = PRFData | PositionData;

export default function EditRequestItem() {
  const { type, id } = useParams<{ type: "prf" | "position"; id: string }>();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [item, setItem] = useState<EditItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch item data based on type and id
  useEffect(() => {
    if (!type || !id) {
      setError("Invalid parameters");
      setLoading(false);
      return;
    }

    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = type === "prf" ? `/api/prf/${id}/` : `/api/job/${id}/`;
        const response = await axiosPrivate.get<EditItem>(endpoint);

        console.log(response.data);

        setItem(response.data);
      } catch (err: any) {
        console.error("Error fetching item:", err);
        setError("Failed to load item. Please try again.");
        toast.error("Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [type, id, axiosPrivate]);

  // Handle form submission
  const handleSave = async (formData: EditItem) => {
    if (!type || !id) return;

    try {
      setSaving(true);

      const endpoint = type === "prf" ? `/api/prf/${id}/` : `/api/job/${id}/`;
      await axiosPrivate.patch<EditItem>(endpoint, formData);

      toast.success(
        `${type === "prf" ? "PRF" : "Position"} updated successfully`
      );
      navigate("/requests");
    } catch (err: any) {
      console.error("Error saving item:", err);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (error || !item || !type) {
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
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/requests")}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Edit {type === "prf" ? "PRF" : "Position"}
            </h1>
            <p className="text-gray-600">
              {item.job_title} • ID: {item.unique_id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              item.status === "draft"
                ? "bg-yellow-100 text-yellow-800"
                : item.status === "active"
                ? "bg-green-100 text-green-800"
                : item.status === "closed"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {type === "prf" ? (
          <PRFEditForm
            initialData={item as PRFData}
            onSave={handleSave}
            saving={saving}
          />
        ) : (
          <PositionEditForm
            initialData={item as PositionData}
            onSave={handleSave}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
}
