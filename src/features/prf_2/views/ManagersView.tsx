import { usePositionDetail } from "@/shared/hooks/usePositions";
import { useParams } from "react-router-dom";
import { PRFManagersView } from "@/features/prf_2/components/manager/PRFManagersView";
import type { PRFResponse } from "@/features/prf_2/types/LegacyPRFCompat";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";

export default function ManagersView() {
  const params = useParams();
  const { position, loading } = usePositionDetail({
    id: Number(params.positionId),
  });

  const approvers =
    position && "type" in (position as PRFResponse).job_posting
      ? (position as PRFResponse).job_posting.type === "prf"
        ? (position as PRFResponse).approving_managers
        : []
      : [];

  if (loading) return <LoadingComponent />;

  return (
    <PRFManagersView approvers={approvers} formData={position as PRFResponse} />
  );
}
