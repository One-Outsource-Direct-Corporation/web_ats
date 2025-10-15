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
import { useEffect, useState } from "react";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import type { Job } from "@/features/jobs/types/jobTypes";

const statusColor: Record<string, string> = {
  Published: "bg-green-100 text-green-700",
  Closed: "bg-red-100 text-red-700",
  Draft: "bg-gray-100 text-gray-600",
  Pending: "bg-yellow-100 text-yellow-700",
};

function getStatusCircle(status?: string) {
  const color = statusColor[status || ""] || "bg-gray-200 text-gray-600";
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full items-center justify-center text-xs font-bold ${color}`}
      style={{ minWidth: "2.5rem", textAlign: "center" }}
      title={status}
    >
      {status || "-"}
    </span>
  );
}

export default function Job() {
  const navigate = useNavigate();
  const jobs = useJobs();
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");
  const [dynamicLink, setDynamicLink] = useState<string>("");

  const formatJobSlug = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  const handleJobTitleClick = (jobTitle: string) => {
    setSelectedJobTitle(jobTitle);
    const jobSlug = formatJobSlug(jobTitle);
    const generatedLink = `/job/${jobSlug}`;
    setDynamicLink(generatedLink);
    navigate(generatedLink, {
      state: {
        jobTitle: jobTitle,
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
                }}
                className="text-sm text-blue-500 hover:underline cursor-pointer pb-2"
              >
                Clear filters
              </Button>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Input placeholder="Search applicants..." className="w-64" />
              <div className="flex flex-wrap gap-2 ml-auto">
                {[
                  "All Internal",
                  "All Status",
                  "All Job Position",
                  "All Departments",
                  "Employment Type",
                ].map((label) => (
                  <Select key={label}>
                    <SelectTrigger className="min-w-[160px] bg-gray-100">
                      <SelectValue placeholder={label} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{label}</SelectItem>
                    </SelectContent>
                  </Select>
                ))}
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
                  <th className="px-4 py-2 text-center">Department</th>
                  <th className="px-4 py-2 text-center">Employment Type</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center">Created</th>
                  <th className="px-4 py-2 text-center">Total Candidates</th>
                  <th className="px-4 py-2 text-center">Vacancies</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job: Job) => (
                    <tr key={job.id} className="border-t text-sm text-gray-800">
                      <td className="px-4 py-3">
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleJobTitleClick(job.title)}
                          className="text-left hover:underline hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {job.title}
                        </Button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {job.department || "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {job.employmentType || "-"}
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
