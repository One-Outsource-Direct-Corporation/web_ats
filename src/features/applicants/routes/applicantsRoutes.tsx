import Applicants from "@/pages/applicants/Applicants";
import PoolApplicants from "@/pages/applicants/PoolApplicants";

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
