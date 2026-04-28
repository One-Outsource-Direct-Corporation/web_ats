import Applicants from "../views/Applicants";
import PoolApplicants from "../views/PoolApplicants";
import PipelineApplicants from "../views/PipelineApplicants";
import OfferAndFinalization from "../views/OfferAndFinalization";
import Onboarding from "../views/Onboarding";
import Warm from "../views/Warm";
import Failed from "../views/Failed";

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
  // Unified route for applicants view by process type
  {
    path: ":jobId/applicants",
    element: <PipelineApplicants />,
  },
  // Legacy stage routes mapped to the unified applicants page
  {
    path: ":jobId/resumescreening",
    element: <PipelineApplicants />,
  },
  {
    path: ":jobId/phonecallinterview",
    element: <PipelineApplicants />,
  },
  {
    path: ":jobId/shortlisted",
    element: <PipelineApplicants />,
  },
  {
    path: ":jobId/initialinterview",
    element: <PipelineApplicants />,
  },
  {
    path: ":jobId/assessments",
    element: <PipelineApplicants />,
  },
  {
    path: ":jobId/finalinterview",
    element: <PipelineApplicants />,
  },
  {
    path: ":jobId/forjoboffer",
    element: <PipelineApplicants />,
  },
  // Custom final stages (without jobId)
  {
    path: "stage/OfferAndFinalization",
    element: <OfferAndFinalization />,
  },
  {
    path: "stage/Onboarding",
    element: <Onboarding />,
  },
  {
    path: "stage/Warm",
    element: <Warm />,
  },
  {
    path: "stage/Failed",
    element: <Failed />,
  },
];
