import Applicants from "../views/Applicants";
import PoolApplicants from "../views/PoolApplicants";

export const applicantsRoutes = [
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
];
