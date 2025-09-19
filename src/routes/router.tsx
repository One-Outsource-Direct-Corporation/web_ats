import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/shared/pages/RootLayout";
import Requests from "@/shared/pages/requests/Requests.tsx";
import MainApp from "@/shared/pages/applicantview/ApplicantMainPage";
import { applicantsRoutes } from "@/features/applicants/routes/applicantsRoutes.tsx";
import { jobsRoutes } from "@/features/jobs/routes/jobsRoutes.tsx";
import { interviewsRoutes } from "@/features/interviews/routes/interviewsRoutes.tsx";
import { positionRoutes } from "@/features/positions/routes/positionRoutes";
import { prfRoutes } from "@/features/prf/routes/prfRoutes";
import { libraryRoutes } from "@/features/library/routes/libraryRoutes";
import { dashboardRoutes } from "@/features/dashboard/routes/dashboardRoutes";
import { authRoutes } from "@/features/auth/routes/authRoutes";

export const router = createBrowserRouter([
  ...authRoutes,
  {
    element: <RootLayout />,
    children: [
      ...dashboardRoutes,
      ...positionRoutes,
      ...libraryRoutes,
      {
        path: "requests",
        element: <Requests />,
      },
      ...jobsRoutes,
      ...applicantsRoutes,
      ...interviewsRoutes,
      ...prfRoutes,
    ],
  },
  {
    path: "applicant",
    children: [
      {
        index: true,
        element: <MainApp />,
      },
    ],
  },
]);
