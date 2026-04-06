import FeaturePRF from "@/features/prf/views/PRF";
import type { PRFFormData } from "@/features/prf/types/prf.types";

interface PRFPageProps {
  initialData?: PRFFormData;
  updateMode?: boolean;
}

export default function PRFPage(props: PRFPageProps) {
  return <FeaturePRF {...props} />;
}
