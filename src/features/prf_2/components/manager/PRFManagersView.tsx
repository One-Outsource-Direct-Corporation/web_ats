import type { ApproverDb } from "@/features/external_posting";
import type { PRFFormData } from "@/features/prf_2/types/LegacyPRFCompat";
import Approver from "@/features/prf_2/components/manager/Approver";
import PRFSummary from "@/features/prf_2/components/manager/PRFSummary";

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
