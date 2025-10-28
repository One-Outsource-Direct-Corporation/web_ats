import Applicants from "../views/Applicants";
import PoolApplicants from "../views/PoolApplicants";
import ResumeScreening from "../views/ResumeScreening";
import PhoneInterview from "../views/PhoneInterview";
import Shortlisted from "../views/Shortlisted";
import InitialInterview from "../views/InitialInterview";
import Assessment from "../views/Assessment";
import FinalInterview from "../views/FinalInterview";
import ForJobOffer from "../views/ForJobOffer";
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
  // Stage routes nested under :jobtitle
  {
    path: ":jobtitle/resumescreening",
    element: <ResumeScreening />,
  },
  {
    path: ":jobtitle/phonecallinterview",
    element: <PhoneInterview />,
  },
  {
    path: ":jobtitle/shortlisted",
    element: <Shortlisted />,
  },
  {
    path: ":jobtitle/initialinterview",
    element: <InitialInterview />,
  },
  {
    path: ":jobtitle/assessments",
    element: <Assessment />,
  },
  {
    path: ":jobtitle/finalinterview",
    element: <FinalInterview />,
  },
  {
    path: ":jobtitle/forjoboffer",
    element: <ForJobOffer />,
  },
  // Custom final stages (without jobtitle)
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
