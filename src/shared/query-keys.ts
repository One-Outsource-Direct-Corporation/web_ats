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
  candidates: {
    all: ["candidates"] as const,
    applications: () => [...queryKeys.candidates.all, "applications"] as const,
    application: (id: number | string) =>
      [...queryKeys.candidates.all, "application", id] as const,
    profile: {
      details: () => [...queryKeys.candidates.all, "profile", "details"] as const,
      prefill: (jobId: number | string) =>
        [...queryKeys.candidates.all, "profile", "prefill", jobId] as const,
      config: () => [...queryKeys.candidates.all, "profile", "config"] as const,
      events: () => [...queryKeys.candidates.all, "profile", "events"] as const,
    },
  },
  assessments: {
    all: ["assessments"] as const,
    templates: (params?: { pageSize?: number; search?: string }) =>
      [...queryKeys.assessments.all, "templates", params?.pageSize ?? 20, params?.search ?? ""] as const,
    candidate: (candidateApplicationId: number, pipelineStepId?: number) =>
      [...queryKeys.assessments.all, "candidate", candidateApplicationId, pipelineStepId ?? "all"] as const,
  },
  ief: {
    all: ["ief"] as const,
    templates: () => [...queryKeys.ief.all, "templates"] as const,
    forms: (candidateId: number, pipelineStepId?: number) =>
      [...queryKeys.ief.all, "forms", candidateId, pipelineStepId ?? "all"] as const,
    prefill: (candidateId: number, pipelineStepId?: number) =>
      [...queryKeys.ief.all, "prefill", candidateId, pipelineStepId ?? "all"] as const,
  },
  emailTemplates: {
    all: ["emailTemplates"] as const,
    listing: (params?: { page?: number; pageSize?: number; search?: string }) =>
      [...queryKeys.emailTemplates.all, "listing", params?.page ?? 1, params?.pageSize ?? 50, params?.search ?? ""] as const,
    detail: (id: number) => [...queryKeys.emailTemplates.all, "detail", id] as const,
  },
  businessUnits: {
    all: ["businessUnits"] as const,
    listing: () => [...queryKeys.businessUnits.all, "listing"] as const,
  },
  clients: {
    all: ["clients"] as const,
    listing: (params?: { page?: number; search?: string }) =>
      [...queryKeys.clients.all, "listing", params?.page ?? 1, params?.search ?? ""] as const,
  },
  departments: {
    all: ["departments"] as const,
    listing: (params?: { page?: number; search?: string; business_unit?: string; nested?: boolean }) =>
      [...queryKeys.departments.all, "listing", params?.page ?? 1, params?.search ?? "", params?.business_unit ?? "", params?.nested ?? false] as const,
  },
  jobOffers: {
    all: ["jobOffers"] as const,
    list: (candidateId?: number) =>
      [...queryKeys.jobOffers.all, "list", candidateId ?? "all"] as const,
  },
  documents: {
    all: ["documents"] as const,
    list: () => [...queryKeys.documents.all, "list"] as const,
  },
  preonboarding: {
    all: ["preonboarding"] as const,
    data: () => [...queryKeys.preonboarding.all, "data"] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    me: () => [...queryKeys.dashboard.all, "me"] as const,
  },
} as const;
