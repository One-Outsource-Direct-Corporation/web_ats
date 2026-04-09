import PRFCreation from "@/Pages/PRFCreation";
import type { PRFFormData } from "@/features/prf_2/types/LegacyPRFCompat";

interface PRFPageProps {
  initialData?: PRFFormData;
  updateMode?: boolean;
}

export default function PRFPage(props: PRFPageProps) {
  return <PRFCreation {...props} />;
}
