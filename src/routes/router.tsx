import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "@/shared/pages/RootLayout";
import ErrorPage from "@/shared/pages/ErrorPage";
import NotFoundPage from "@/shared/pages/NotFoundPage";
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
import { candidateRoutes } from "@/features/candidate/routes/candidateRoutes";
import TalentPool from "@/features/talent-pool/views/TalentPool";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PersistLogin />,
    errorElement: <ErrorPage />,
    children: [
      ...publicJobsRoutes,
      ...candidateRoutes,
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
        element: (
          <ProtectedRoutes>
            <RootLayout />
          </ProtectedRoutes>
        ),
        errorElement: <ErrorPage />,
        children: [
          ...dashboardRoutes,
          ...positionRoutes,
          {
            path: "pool",
            element: <TalentPool />,
          },
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
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
