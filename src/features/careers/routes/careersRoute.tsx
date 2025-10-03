import CareerDescription from "../views/CareerDescription";
import CareersApply from "../views/CareersApply";
import CareersLandingPage from "../views/CareersLandingPage";

export const careersRoutes = [
  {
    index: true,
    element: <CareersLandingPage />,
  },
  {
    path: "careers/:jobId",
    children: [
      {
        index: true,
        element: <CareerDescription />,
      },
      {
        path: "apply",
        element: <CareersApply />,
      },
    ],
  },
];
