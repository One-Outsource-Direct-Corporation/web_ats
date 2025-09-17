import JobDetails from "../views/JobDetails";
import Job from "../views/Job";
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
      ...applicantsRoutes,
    ],
  },
];
