import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/pages/RootLayout";
import Login from "@/pages/Login.tsx";
import Requests from "@/pages/requests/Requests.tsx";
import MainApp from "@/pages/applicantview/ApplicantMainPage";
import { applicantsRoutes } from "@/features/applicants/routes/applicantsRoutes.tsx";
import { jobsRoutes } from "@/features/jobs/routes/jobsRoutes.tsx";
import { interviewsRoutes } from "@/features/interviews/routes/interviewsRoutes.tsx";
import { positionRoutes } from "@/features/positions/routes/positionRoutes";
import { prfRoutes } from "@/features/prf/routes/prfRoutes";
import { libraryRoutes } from "@/features/library/routes/libraryRoutes";
import { dashboardRoutes } from "@/features/dashboard/routes/dashboardRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
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
