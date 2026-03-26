export const queryKeys = {
  jobs: {
    all: ["jobs"] as const,
    listing: () => [...queryKeys.jobs.all, "listing"] as const,
  },
  externalPosting: {
    all: ["external_posting"] as const,
    listing: () => [...queryKeys.externalPosting.all, "listing"] as const,
    detail: (id: number | string) =>
      [...queryKeys.externalPosting.all, "detail", id] as const,
  },
  prf: {
    all: ["prf"] as const,
    listing: () => [...queryKeys.prf.all, "listing"] as const,
    users: (position?: string) =>
      [...queryKeys.prf.all, "users", position ?? "all"] as const,
    usersByDepartment: (params: {
      businessUnit: string;
      departmentName: string;
      email?: string;
      include?: string;
    }) =>
      [
        ...queryKeys.prf.all,
        "users-by-department",
        params.businessUnit,
        params.departmentName,
        params.email ?? "",
        params.include ?? "",
      ] as const,
    detail: (id: number | string) =>
      [...queryKeys.prf.all, "detail", id] as const,
  },
} as const;
