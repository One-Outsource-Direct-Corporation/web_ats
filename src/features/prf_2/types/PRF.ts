import type { BusinessUnit } from "@/features/prf_2/types/enums/BusinessUnit.ts";
import type { CategoryChoices } from "@/features/prf_2/types/enums/CategoryChoices.ts";
import type { User } from "@/features/auth/types/auth.types";
import type {
  DepartmentEntity,
  DepartmentEntitySimple,
} from "@/features/department/types/department.types";

export type ImmediateSupervisorObject = Pick<
  User,
  "id" | "first_name" | "middle_name" | "last_name" | "role"
>;

export type DepartmentObject = DepartmentEntity | DepartmentEntitySimple;

export interface PRFCreatePayload {
  business_unit: BusinessUnit | "";
  immediate_supervisor: number | "";
  immediate_supervisor_display: string | null; // For display purposes only, not sent to backend
  category: CategoryChoices | "";
  hardware_required: Record<string, boolean>;
  software_required: Record<string, boolean>;
}
