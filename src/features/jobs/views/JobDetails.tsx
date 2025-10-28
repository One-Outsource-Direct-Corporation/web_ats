import { useEffect, useState } from "react";
import { useJobByTitle } from "../hooks/useJobs";
import { Input } from "@/shared/components/ui/input.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { ArrowLeft, LayoutGrid, List } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { formatJobTitle, getStageRoutePath } from "../utils/jobFormatters";

export default function JobDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobtitle } = useParams<{ jobtitle: string }>();

  const [currentJobTitle, setCurrentJobTitle] = useState<string>("");
  const job = useJobByTitle(currentJobTitle);
  const [selectedStage, setSelectedStage] = useState<string>("");

  useEffect(() => {
    if (location.state?.jobTitle) {
      setCurrentJobTitle(location.state.jobTitle);
    } else if (jobtitle) {
      setCurrentJobTitle(formatJobTitle(jobtitle));
    }
  }, [location.state, jobtitle]);

  const handleStageClick = (stageName: string) => {
    setSelectedStage(stageName);

    const jobSlug = currentJobTitle.toLowerCase().replace(/\s+/g, "");
    const path = getStageRoutePath(stageName, jobSlug);

    // Navigate
    navigate(path, {
      state: {
        jobTitle: currentJobTitle,
        stageName,
      },
    });
  };

  useEffect(() => {
    document.title = `Applicants - ${currentJobTitle || "Job Details"}`;
  }, [currentJobTitle]);

  const stages = [
    {
      title: "STAGE 01 - HR Interview",
      steps: ["Resume Screening", "Phone Call Interview", "Shortlisted"],
    },
    {
      title: "STAGE 02 - Hiring Manager/Client",
      steps: ["Initial Interview", "Assessments", "Final Interview"],
    },
    {
      title: "STAGE 03 - Final Stage",
      steps: [
        "For Job Offer",
        "For Offer and Finalization",
        "Onboarding",
        "Warm",
        "Failed",
      ],
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/job/`)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-3xl font-bold text-gray-800">
                  {currentJobTitle || "Job Details"}
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    navigate(
                      `/job/${currentJobTitle
                        ?.toLowerCase()
                        .replace(/\s+/g, "")}/weekly`,
                      {
                        state: { jobTitle: currentJobTitle },
                      }
                    )
                  }
                >
                  <LayoutGrid className="text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon">
                  <List className="text-blue-800" />
                </Button>
              </div>
            </div>

            {/* Job Info Display */}
            {job && (
              <div className="bg-white border rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Department:</span>
                    <span className="ml-2 font-semibold">{job.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Employment Type:</span>
                    <span className="ml-2 font-semibold">
                      {job.employmentType}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2 font-semibold">{job.status}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Stage Display */}
            {selectedStage && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  Last selected stage:{" "}
                  <span className="font-semibold">{selectedStage}</span>
                </p>
              </div>
            )}

            {/* Search */}
            <div>
              <Input placeholder="Search" className="max-w-md bg-gray-100" />
            </div>

            <hr />

            {/* Stages */}
            <div className="space-y-10">
              {stages.map((stage) => (
                <div key={stage.title} className="space-y-4">
                  <h2 className="text-md font-semibold text-gray-800">
                    {stage.title}
                  </h2>
                  <div className="border rounded-md divide-y">
                    {stage.steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center px-4 py-3 hover:bg-gray-50"
                      >
                        <span>{step}</span>
                        <Button
                          variant="link"
                          className="text-blue-600 text-sm px-0 hover:underline"
                          onClick={() => handleStageClick(step)}
                        >
                          View Applicants
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
