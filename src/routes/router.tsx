import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/shared/pages/RootLayout";
import { applicantsRoutes } from "@/features/applicants/routes/applicantsRoutes.tsx";
import { jobsRoutes } from "@/features/jobs/routes/jobsRoutes.tsx";
import { interviewsRoutes } from "@/features/interviews/routes/interviewsRoutes.tsx";
import { positionRoutes } from "@/features/positions/routes/positionRoutes";
import { prfRoutes } from "@/features/prf/routes/prfRoutes";
import { libraryRoutes } from "@/features/library/routes/libraryRoutes";
import { dashboardRoutes } from "@/features/dashboard/routes/dashboardRoutes";
import ProtectedRoutes from "@/features/auth/components/ProtectedRoutes";
import Login from "@/features/auth/views/Login";
import PersistLogin from "@/features/auth/components/PersistLogin";
import { publicJobsRoutes } from "@/features/jobs/public/routes/careersRoute";
import { requestRoutes } from "@/features/requests/routes/requestRoutes";
import PRFCreation from "@/Pages/PRFCreation";

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
        element: (
          <ProtectedRoutes>
            <RootLayout />
          </ProtectedRoutes>
        ),
        children: [
          ...dashboardRoutes,
          ...positionRoutes,
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
        element: <PRFCreation />,
      },
    ],
  },
]);
