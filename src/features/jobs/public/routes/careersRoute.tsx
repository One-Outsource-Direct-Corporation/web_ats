import { Navigate, useParams } from "react-router-dom";
import CareerDescription from "../views/CareerDescription";
import CareersApply from "../views/CareersApply";
import CareersLandingPage from "../views/CareersLandingPage";
import ApplicationTracker from "../views/ApplicationTracker";

function LegacyJobRedirect() {
  const { jobId } = useParams();
  if (!jobId) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={`/jobs/${jobId}`} replace />;
}

function LegacyApplyRedirect() {
  const { jobId } = useParams();
  if (!jobId) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={`/jobs/${jobId}/apply`} replace />;
}

export const publicJobsRoutes = [
  {
    index: true,
    element: <CareersLandingPage />,
  },
  {
    path: "jobs/:jobId",
    children: [
      {
        index: true,
        element: <CareerDescription />,
      },
      {
        path: "apply",
        element: <CareersApply />,
      },
    ],
  },
  {
    path: "track",
    element: <ApplicationTracker />,
  },
  {
    path: "careers/:jobId/apply",
    element: <LegacyApplyRedirect />,
  },
  {
    path: "careers/:jobId",
    element: <LegacyJobRedirect />,
  },
];
