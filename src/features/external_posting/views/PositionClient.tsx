import ExternalPostingForm from "./ExternalPostingForm";
import type { PositionFormData } from "@/features/external_posting/types/externalPosting.types";

interface PositionClientProps {
  initialData?: PositionFormData;
  updateMode?: boolean;
}

export default function PositionClient(props: PositionClientProps) {
  return <ExternalPostingForm {...props} />;
}
