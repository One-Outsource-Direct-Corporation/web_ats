import { usePositionDetail } from "@/shared/hooks/usePositions";
import { useParams } from "react-router-dom";
import { PRFManagersView } from "../components/PRFManagersView";
import type { PRFResponse } from "../types/prf.types";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";

export default function ManagersView() {
  const params = useParams();
  const { position, loading } = usePositionDetail({
    id: Number(params.positionId),
  });

  console.log(position);

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
