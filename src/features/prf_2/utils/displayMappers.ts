import type {
  DepartmentObject,
  ImmediateSupervisorObject,
} from "@/features/prf_2/types/PRF";

export function getImmediateSupervisorDisplay(
  immediateSupervisor: ImmediateSupervisorObject | null,
): string | null {
  if (!immediateSupervisor) {
    return null;
  }

  return `${immediateSupervisor.first_name} ${immediateSupervisor.last_name}`;
}

export function getDepartmentName(
  department: DepartmentObject | null,
): string | null {
  if (!department) {
    return null;
  }

  return department.name;
}
