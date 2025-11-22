import type { ApproverDb } from "@/features/positions-client/types/create_position.types";
import type { PRFFormData } from "../types/prf.types";
import Approver from "./Approver";
import PRFSummary from "./PRFSummary";

interface PRFManagersViewProps {
  approvers: ApproverDb[] | [];
  formData: PRFFormData;
}

export function PRFManagersView({ formData, approvers }: PRFManagersViewProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <PRFSummary formData={formData} />
      <div className="space-y-6">
        <h2 className="text-blue-700 font-bold text-sm border-l-4 border-blue-700 pl-2 uppercase">
          APPROVAL
        </h2>
        <Approver approvers={approvers} formData={formData} />
      </div>
    </div>
  );
}
