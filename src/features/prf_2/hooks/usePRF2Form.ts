import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
  DepartmentObject,
  ImmediateSupervisorObject,
} from "@/features/prf_2/types/PRF";
import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";
import {
  getDepartmentName,
  getImmediateSupervisorDisplay,
} from "@/features/prf_2/utils/displayMappers";
import { createInitialPRF2Data } from "@/features/prf_2/utils/prfInitialData";

export function usePRF2Form(initialData?: PRFFormData) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<PRFFormData>(
    initialData ?? createInitialPRF2Data(user),
  );

  function setDepartment(department: DepartmentObject | null) {
    setFormData((prev) => ({
      ...prev,
      department,
      department_name: getDepartmentName(department),
      job_posting: {
        ...prev.job_posting,
        department: department ? department.id : "",
      },
      prf_input: {
        ...prev.prf_input,
        immediate_supervisor: "",
      },
      immediate_supervisor: null,
      immediate_supervisor_display: null,
    }));
  }

  function setImmediateSupervisor(
    immediateSupervisor: ImmediateSupervisorObject | null,
  ) {
    setFormData((prev) => ({
      ...prev,
      immediate_supervisor: immediateSupervisor,
      immediate_supervisor_display:
        getImmediateSupervisorDisplay(immediateSupervisor),
      prf_input: {
        ...prev.prf_input,
        immediate_supervisor: immediateSupervisor ? immediateSupervisor.id : "",
      },
    }));
  }

  function serializeFormData(): PRFFormData {
    return {
      ...formData,
      job_posting: {
        ...formData.job_posting,
        department: formData.department
          ? formData.department.id
          : formData.job_posting.department,
      },
      prf_input: {
        ...formData.prf_input,
        immediate_supervisor: formData.immediate_supervisor
          ? formData.immediate_supervisor.id
          : formData.prf_input.immediate_supervisor,
      },
    };
  }

  return {
    formData,
    setFormData,
    setDepartment,
    setImmediateSupervisor,
    serializeFormData,
  };
}
