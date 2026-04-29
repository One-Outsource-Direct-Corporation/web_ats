import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "@/shared/pages/RootLayout";
import { applicantsRoutes } from "@/features/applicants/routes/applicantsRoutes.tsx";
import { jobsRoutes } from "@/features/jobs/routes/jobsRoutes.tsx";
import { interviewsRoutes } from "@/features/interviews/routes/interviewsRoutes.tsx";
import { positionRoutes } from "@/features/positions/routes/positionRoutes";
import { prfRoutes } from "@/features/prf_2/routes/prfRoutes";
import { libraryRoutes } from "@/features/library/routes/libraryRoutes";
import IEFTemplateLibrary from "@/features/library/views/IEFTemplateLibrary";
import { dashboardRoutes } from "@/features/dashboard/routes/dashboardRoutes";
import ProtectedRoutes from "@/features/auth/components/ProtectedRoutes";
import Login from "@/features/auth/views/Login";
import PersistLogin from "@/features/auth/components/PersistLogin";
import { publicJobsRoutes } from "@/features/jobs/public/routes/careersRoute";
import { requestRoutes } from "@/features/requests/routes/requestRoutes";
import ApplicationTracker from "@/features/jobs/public/views/ApplicationTracker";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PersistLogin />,
    children: [
      ...publicJobsRoutes,
      {
        path: "login",
        children: [
          {
            index: true,
            element: <Login />,
          },
        ],
      },
      {
        path: "track",
        element: <ApplicationTracker/>
      },
      {
        element: (
          <ProtectedRoutes>
            <RootLayout />
          </ProtectedRoutes>
        ),
        children: [
          ...dashboardRoutes,
          ...positionRoutes,
          // Explicit route for IEF Template Library to avoid 404 on direct navigation
          {
            path: "library/ief-templates",
            element: <IEFTemplateLibrary />,
          },
          ...libraryRoutes,
          ...requestRoutes,
          ...jobsRoutes,
          ...applicantsRoutes,
          ...interviewsRoutes,
          ...prfRoutes,
        ],
      },
      {
        path: "prf_2",
        element: <Navigate to="/prf" replace />,
      },
    ],
  },
]);
