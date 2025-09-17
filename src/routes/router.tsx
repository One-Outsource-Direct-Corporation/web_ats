import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/pages/RootLayout";
import Login from "@/pages/Login.tsx";
import Dashboard from "@/features/dashboard/components/Dashboard";
import Library from "@/pages/library/Library.tsx";
import Requests from "@/pages/requests/Requests.tsx";
import MainApp from "@/pages/applicantview/ApplicantMainPage";
import { applicantsRoutes } from "@/features/applicants/routes/applicantsRoutes.tsx";
import { jobsRoutes } from "@/features/jobs/routes/jobsRoutes.tsx";
import { interviewsRoutes } from "@/features/interviews/routes/interviewsRoutes.tsx";
import { positionRoutes } from "@/features/positions/routes/positionRoutes";
import { prfRoutes } from "@/features/prf/routes/prfRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: "dashboard",
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
      ...positionRoutes,
      {
        path: "library",
        element: <Library />,
      },
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
