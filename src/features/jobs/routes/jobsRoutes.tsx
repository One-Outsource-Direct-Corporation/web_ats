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
        path: ":jobtitle",
        element: <JobDetails />,
      },
      {
        path: ":jobtitle/weekly",
        element: <JobWeeklyView />,
      },
      ...applicantsRoutes,
    ],
  },
];
