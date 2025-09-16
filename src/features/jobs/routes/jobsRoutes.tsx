// import Job from "@/pages/applicants/Job";
import JobDetails from "../views/JobDetails";
import Applicants from "../../applicants/views/Applicants";
import PoolApplicants from "../../applicants/views/PoolApplicants";
import Job from "@/features/applicants/views/Job";

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
        path: "list/applicants",
        children: [
          {
            index: true,
            element: <Applicants />,
          },
          {
            path: "pool",
            element: <PoolApplicants />,
          },
        ],
      },
    ],
  },
];
