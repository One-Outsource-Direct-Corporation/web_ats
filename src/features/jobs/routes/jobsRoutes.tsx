import JobDetails from "../views/JobDetails";
import Job from "../views/Job";
import JobWeeklyView from "../views/JobWeeklyView";
import { applicantsRoutes } from "@/features/applicants/routes/applicantsRoutes";

export const jobsRoutes = [
  {
    path: "/job",
    children: [
      {
        index: true,
        element: <Job />,
      },
      {
        path: ":jobId",
        element: <JobDetails />,
      },
      {
        path: ":jobId/weekly",
        element: <JobWeeklyView />,
      },
      ...applicantsRoutes,
    ],
  },
];
