import Applicants from "../views/Applicants";
import ApplicantsInformationTab from "../views/ApplicantsInformationTab";
import PoolApplicants from "../views/PoolApplicants";
import PipelineApplicants from "../views/PipelineApplicants";
import PipelineApplicantStatusPage from "../views/PipelineApplicantStatusPage";
import ExamForm from "../views/Exam-Form.tsx";

import OfferAndFinalization from "../views/OfferAndFinalization";
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
      {
        path: ":applicantId",
        element: <ApplicantsInformationTab />,
      },
    ],
  },
  // Unified route for applicants view by process type
  {
    path: ":jobId/applicants",
    element: <PipelineApplicants />,
  },
  {
    path: ":jobId/exam-form/:applicantId",
    element: <ExamForm />,
  },
  {
    path: ":jobId/applicants/status",
    element: <PipelineApplicantStatusPage />,
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
  {
    path: ":jobId/onboarding",
    element: <PipelineApplicants />,
  },
  // Custom final stages (without jobId)
  {
    path: "stage/OfferAndFinalization",
    element: <OfferAndFinalization />,
  },
  {
    path: "stage/PreOnboarding",
    element: <PipelineApplicants />,
  },
  {
    path: "stage/Onboarding",
    element: <PipelineApplicants />,
  },
  {
    path: "stage/Failed",
    element: <Failed />,
  },
];
