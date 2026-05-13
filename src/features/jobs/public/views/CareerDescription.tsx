import { useEffect } from "react";
import { ArrowUp, ArrowLeft, LogIn, UserPlus, Briefcase } from "lucide-react";
import { Button } from "@/shared/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import DOMPurify from "dompurify";
import formatName from "@/shared/utils/formatName";
import { useJobPublicDetail } from "../hooks/useJobPublicDetail";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function CareerDescription() {
  const navigate = useNavigate();
  const params = useParams();
  const { jobPublicDetail, loading, error } = useJobPublicDetail(params.jobId);
  const { user, isAuth } = useAuth();

  const isCandidate = isAuth && user?.role === "candidate";
  const isLoggedInNonCandidate = isAuth && user?.role !== "candidate";

  useEffect(() => {
    document.title = jobPublicDetail?.job_title
      ? `${jobPublicDetail.job_title}`
      : "Career Details";
  }, [jobPublicDetail?.job_title]);

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
              {jobPublicDetail?.job_title}
            </h1>
          </div>

          {/* Department and Role */}
          {jobPublicDetail?.department?.name && (
            <div className="text-gray-600 mb-6 ml-9">
              {formatName(jobPublicDetail.department.name)}
            </div>
          )}

          {/* Action Buttons - Auth Aware */}
          <div className="flex gap-4 ml-9 flex-wrap items-center">
            {isCandidate && jobPublicDetail?.has_applied ? (
              <Button
                disabled
                className="bg-gray-400 cursor-not-allowed px-6 py-2 text-white"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Already Applied
              </Button>
            ) : isCandidate && jobPublicDetail?.all_locations_full ? (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 max-w-md">
                <p className="text-gray-600 text-sm">
                  This position is no longer accepting applications.
                </p>
              </div>
            ) : isCandidate ? (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                onClick={() => {
                  if (params.jobId) {
                    navigate(`/jobs/${params.jobId}/apply`);
                  }
                }}
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Apply Now
              </Button>
            ) : isLoggedInNonCandidate ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md">
                <p className="text-amber-800 text-sm">
                  You are logged in as a <strong>{user?.role}</strong>. 
                  Please use a candidate account to apply for this position.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    onClick={() => navigate("/candidate/register")}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Create Candidate Account
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  onClick={() => {
                    navigate(`/login`, { state: { from: `/jobs/${params.jobId}/apply`, role: "candidate" } });
                  }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login to Apply
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                  onClick={() => navigate("/candidate/register")}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              className="px-6 py-2 text-gray-600 hover:text-gray-900"
              onClick={() => navigate("/")}
            >
              View Other Openings
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
                {jobPublicDetail?.employment_type &&
                  formatName(jobPublicDetail.employment_type)}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-gray-900 mb-2">Work Setup</h3>
              <p className="text-gray-600">
                {jobPublicDetail?.work_setup &&
                  formatName(jobPublicDetail.work_setup)}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-gray-900 mb-2">Department</h3>
              <p className="text-gray-600">
                {jobPublicDetail?.department?.name
                  ? formatName(jobPublicDetail.department.name)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Job Summary */}
        {jobPublicDetail?.description && (
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
                __html: DOMPurify.sanitize(jobPublicDetail.description),
              }}
            />
          </div>
        )}

        {/* Responsibilities */}
        {jobPublicDetail?.responsibilities && (
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
                __html: DOMPurify.sanitize(jobPublicDetail.responsibilities),
              }}
            />
          </div>
        )}

        {/* Qualifications */}
        {jobPublicDetail?.qualifications && (
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
                __html: DOMPurify.sanitize(jobPublicDetail.qualifications),
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
