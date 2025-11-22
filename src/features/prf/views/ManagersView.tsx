import { usePositionDetail } from "@/shared/hooks/usePositions";
import { useParams } from "react-router-dom";
import { PRFManagersView } from "../components/PRFManagersView";
import type { PRFDb } from "../types/prf.types";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";

export default function ManagersView() {
  const params = useParams();
  const { position, loading } = usePositionDetail({
    id: Number(params.positionId),
  });

  console.log(params);

  const approvers =
    position && "type" in (position as PRFDb).job_posting
      ? (position as PRFDb).job_posting.type === "prf"
        ? (position as PRFDb).job_posting.approver
        : []
      : [];

  if (loading) return <LoadingComponent />;

  return <PRFManagersView approvers={approvers} formData={position as PRFDb} />;
}
