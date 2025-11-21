import { useEffect } from "react";
import { ArrowUp, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import DOMPurify from "dompurify";
import formatName from "@/shared/utils/formatName";
import { usePositionDetail } from "@/shared/hooks/usePositions";

export default function CareerDescription() {
  const navigate = useNavigate();
  const params = useParams();
  const { position, loading, error } = usePositionDetail({
    id: Number(params.jobId),
    non_admin: true,
  });
  console.log("Position from Hook:", position);

  useEffect(() => {
    document.title = position?.job_posting.job_title
      ? `${position.job_posting.job_title}`
      : "Career Details";
  }, [position?.job_posting.job_title]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-700">{error}</p>
          <Button
            variant="outline"
            className="mt-6 bg-transparent"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-6">
        <div className="max-w-4xl mx-auto">
          {/* Logo - Made clickable */}
          <div className="flex justify-center mb-6 cursor-pointer">
            <img
              src="/OODC%20logo3.png"
              alt="OODC Logo"
              className="h-16"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Job Title with Icon */}
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {position?.job_posting.job_title}
            </h1>
          </div>

          {/* Department and Role */}
          {position?.job_posting.department_name && (
            <div className="text-gray-600 mb-6 ml-9">
              {position.job_posting.department_name === "other"
                ? position.job_posting.department_name_other ?? ""
                : formatName(position.job_posting.department_name)}{" "}
              {"type" in position.job_posting &&
                position.job_posting.type === "client" &&
                "client_display" in position &&
                position.client_display && <>• {position.client_display}</>}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 ml-9 flex-wrap">
            {/* Added flex-wrap for responsiveness */}
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              onClick={() => {
                if (position && "id" in position) {
                  navigate(`/careers/${position.job_posting.id}/apply`);
                }
              }}
            >
              Apply Now
            </Button>
            <Button
              className="px-6 py-2 text-blue-600 border-blue-600 border-1 hover:bg-blue-50 bg-transparent"
              onClick={() => navigate("/")}
            >
              View Other Opening
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Filter Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between flex-wrap gap-6">
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-gray-900 mb-2">Work Type</h3>
              <p className="text-gray-600">
                {position?.job_posting.employment_type &&
                  formatName(position.job_posting.employment_type)}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-gray-900 mb-2">Work Setup</h3>
              <p className="text-gray-600">
                {position?.job_posting.work_setup &&
                  formatName(position.job_posting.work_setup)}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-gray-900 mb-2">Department</h3>
              <p className="text-gray-600">
                {position?.job_posting.department_name === "other"
                  ? formatName(position.job_posting.department_name_other ?? "")
                  : position?.job_posting.department_name &&
                    formatName(position.job_posting.department_name)}
              </p>
            </div>
          </div>
        </div>

        {/* Job Summary */}
        {position?.job_posting.description && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">
                Job Description
              </h2>
            </div>

            <div
              className="text-gray-700 mb-4 preview-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(position.job_posting.description),
              }}
            />
          </div>
        )}

        {/* Responsibilities */}
        {position?.job_posting.responsibilities && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">
                Responsibilities
              </h2>
            </div>
            <div
              className="text-gray-700 text-sm mb-4 preview-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  position.job_posting.responsibilities
                ),
              }}
            />
          </div>
        )}

        {/* Qualifications */}
        {position?.job_posting.qualifications && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">
                Qualifications
              </h2>
            </div>
            <div
              className="text-gray-700 text-sm mb-4 preview-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(position.job_posting.qualifications),
              }}
            />
          </div>
        )}

        {/* Back to Top Button */}
        <div className="flex justify-end mt-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp className="h-4 w-4" />
            Back To Top
          </Button>
        </div>
      </main>
    </div>
  );
}
