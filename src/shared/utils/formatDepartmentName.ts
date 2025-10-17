export function formatDepartmentName(department: string): string {
  const departmentMap: Record<string, string> = {
    sales: "Sales Department",
    "sales-and-marketing": "Sales and Marketing Department",
    finance: "Finance Department",
    hr: "Human Resources Department",
    ci: "Continuous Improvement Department",
    "operations-isla": "Operations - ISLA Department",
    "operations-shell": "Operations - Shell Department",
    "operations-prime": "Operations - Prime Department",
    "operations-rpo": "Operations - RPO Department",
  };
  return departmentMap[department] || department;
}
