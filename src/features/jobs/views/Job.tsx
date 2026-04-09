import { useNavigate } from "react-router-dom";
import { Input } from "@/shared/components/ui/input.tsx";
import { ChevronRightCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select.tsx";
import { useEffect, useMemo, useState } from "react";
import { useJobs, useJobsQuery } from "@/features/jobs/hooks/useJobs";
import type { Job } from "@/features/jobs/types/job.types";
import formatName from "@/shared/utils/formatName";

const statusColor: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  closed: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-gray-100 text-gray-600",
};

function getStatusCircle(status?: string) {
  const normalizedStatus = (status || "").toLowerCase();
  const statusLabel = formatName(status);
  const color = statusColor[normalizedStatus] || "bg-gray-200 text-gray-600";

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full items-center justify-center text-xs font-bold ${color}`}
      style={{ minWidth: "2.5rem", textAlign: "center" }}
      title={statusLabel || "-"}
    >
      {statusLabel || "-"}
    </span>
  );
}

export default function Job() {
  const navigate = useNavigate();
  const jobs = useJobs();
  const { isLoading, isError } = useJobsQuery();
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");
  const [dynamicLink, setDynamicLink] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [postingTypeFilter, setPostingTypeFilter] = useState<
    "all" | "client" | "prf"
  >("all");
  const [clientNameFilter, setClientNameFilter] = useState<string>("all");
  const [internalFilter, setInternalFilter] = useState<
    "all" | "internal" | "external"
  >("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobPositionFilter, setJobPositionFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [employmentTypeFilter, setEmploymentTypeFilter] =
    useState<string>("all");

  const postingTypeOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => job.postingType))).filter(
        (type): type is "client" | "prf" => type === "client" || type === "prf",
      ),
    [jobs],
  );

  const clientNameOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => job.clientName))).filter(
        (name): name is string => Boolean(name && name.trim()),
      ),
    [jobs],
  );

  const statusOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => job.status))).filter(
        (status): status is string => Boolean(status && status.trim()),
      ),
    [jobs],
  );

  const jobPositionOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => job.title))).filter((title) =>
        Boolean(title.trim()),
      ),
    [jobs],
  );

  const departmentOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => job.department))).filter(
        (department): department is string =>
          Boolean(department && department.trim()),
      ),
    [jobs],
  );

  const employmentTypeOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => job.employmentType))).filter(
        (employmentType): employmentType is string =>
          Boolean(employmentType && employmentType.trim()),
      ),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      if (internalFilter === "internal" && job.postingType !== "prf") {
        return false;
      }

      if (internalFilter === "external" && job.postingType !== "client") {
        return false;
      }

      if (
        postingTypeFilter !== "all" &&
        job.postingType !== postingTypeFilter
      ) {
        return false;
      }

      if (clientNameFilter !== "all" && job.clientName !== clientNameFilter) {
        return false;
      }

      if (statusFilter !== "all" && job.status !== statusFilter) {
        return false;
      }

      if (jobPositionFilter !== "all" && job.title !== jobPositionFilter) {
        return false;
      }

      if (departmentFilter !== "all" && job.department !== departmentFilter) {
        return false;
      }

      if (
        employmentTypeFilter !== "all" &&
        job.employmentType !== employmentTypeFilter
      ) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        job.title,
        job.postingType ?? "",
        job.clientName ?? "",
        job.department ?? "",
        job.employmentType ?? "",
        job.status ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [
    jobs,
    internalFilter,
    postingTypeFilter,
    clientNameFilter,
    statusFilter,
    jobPositionFilter,
    departmentFilter,
    employmentTypeFilter,
    searchTerm,
  ]);

  const formatJobSlug = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  const handleJobTitleClick = (job: Job) => {
    setSelectedJobTitle(job.title);
    const jobSlug = formatJobSlug(job.title);
    const generatedLink = `/job/${jobSlug}`;
    setDynamicLink(generatedLink);
    navigate(generatedLink, {
      state: {
        jobTitle: job.title,
        jobId: job.id,
      },
    });
  };

  useEffect(() => {
    document.title = "Applicants | Job Details";
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen pt-[150px] bg-gray-50">
        <div className="fixed top-[64px] left-0 right-0 z-20 bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
          <div className="max-w-7xl mx-auto -space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Applicants</h1>
            <p className="text-lg text-gray-700 mt-5">
              Stores candidate details and tracks their application progress.
            </p>
            {selectedJobTitle && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  Last selected:{" "}
                  <span className="font-semibold">{selectedJobTitle}</span>
                </p>
                <p className="text-xs text-blue-600">
                  Dynamic link: {dynamicLink}
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setSelectedJobTitle("");
                  setDynamicLink("");
                  setSearchTerm("");
                  setInternalFilter("all");
                  setPostingTypeFilter("all");
                  setClientNameFilter("all");
                  setStatusFilter("all");
                  setJobPositionFilter("all");
                  setDepartmentFilter("all");
                  setEmploymentTypeFilter("all");
                }}
                className="text-sm text-blue-500 hover:underline cursor-pointer pb-2"
              >
                Clear filters
              </Button>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Input
                placeholder="Search applicants..."
                className="w-64"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <div className="flex flex-wrap gap-2 ml-auto">
                <Select
                  value={postingTypeFilter}
                  onValueChange={(value) =>
                    setPostingTypeFilter(value as "all" | "client" | "prf")
                  }
                >
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="Posting Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posting Types</SelectItem>
                    {postingTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatName(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={clientNameFilter}
                  onValueChange={(value) => setClientNameFilter(value)}
                >
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="Client Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {clientNameOptions.map((clientName) => (
                      <SelectItem key={clientName} value={clientName}>
                        {clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={internalFilter}
                  onValueChange={(value) =>
                    setInternalFilter(value as "all" | "internal" | "external")
                  }
                >
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="All Internal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Internal</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatName(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={jobPositionFilter}
                  onValueChange={(value) => setJobPositionFilter(value)}
                >
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="All Job Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Job Position</SelectItem>
                    {jobPositionOptions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={departmentFilter}
                  onValueChange={(value) => setDepartmentFilter(value)}
                >
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departmentOptions.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={employmentTypeFilter}
                  onValueChange={(value) => setEmploymentTypeFilter(value)}
                >
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Employment Type</SelectItem>
                    {employmentTypeOptions.map((employmentType) => (
                      <SelectItem key={employmentType} value={employmentType}>
                        {formatName(employmentType)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-grow px-6 pt-[120px] pb-[80px] max-w-7xl mx-auto w-full">
          <div className="overflow-auto rounded-lg border bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Job</th>
                  <th className="px-4 py-2 text-center">Posting Type</th>
                  <th className="px-4 py-2 text-center">Client Name</th>
                  <th className="px-4 py-2 text-center">Department</th>
                  <th className="px-4 py-2 text-center">Employment Type</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center">Created</th>
                  <th className="px-4 py-2 text-center">Total Candidates</th>
                  <th className="px-4 py-2 text-center">Vacancies</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-400">
                      Loading jobs...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-red-500">
                      Failed to load jobs.
                    </td>
                  </tr>
                ) : filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-400">
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job: Job) => (
                    <tr key={job.id} className="border-t text-sm text-gray-800">
                      <td className="px-4 py-3">
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleJobTitleClick(job)}
                          className="text-left hover:underline hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {job.title}
                        </Button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {job.postingType ? formatName(job.postingType) : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {job.clientName || "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {job.department || "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {job.employmentType
                          ? formatName(job.employmentType)
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusCircle(job.status)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {job.created || "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {job.totalCandidates !== undefined
                          ? job.totalCandidates
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {job.vacancies !== undefined ? job.vacancies : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
        <footer className="fixed bottom-0 left-0 right-0 border-t bg-white px-6 py-4 z-30 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-end">
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate("/job/list/applicants")}
              className="flex items-center text-blue-500 text-sm hover:underline"
            >
              <ChevronRightCircle className="w-4 h-4 mr-1" />
              All Applicants
            </Button>
          </div>
        </footer>
      </div>
    </>
  );
}
