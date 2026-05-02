export const queryKeys = {
  jobs: {
    all: ["jobs"] as const,
    listing: () => [...queryKeys.jobs.all, "listing"] as const,
    detail: (id: number | string, includeAllStatuses?: boolean) =>
      [...queryKeys.jobs.all, "detail", id, includeAllStatuses ?? false] as const,
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
      department: number;
      email?: string;
      include?: string;
    }) =>
      [
        ...queryKeys.prf.all,
        "users-by-department",
        params.businessUnit,
        params.department,
        params.email ?? "",
        params.include ?? "",
      ] as const,
    detail: (id: number | string) =>
      [...queryKeys.prf.all, "detail", id] as const,
  },
  applicationFormQuestionnaire: {
    all: ["application_form_questionnaire"] as const,
    templates: (search: string = "", pageSize: number = 10) =>
      [
        ...queryKeys.applicationFormQuestionnaire.all,
        "templates",
        search,
        pageSize,
      ] as const,
  },
} as const;
