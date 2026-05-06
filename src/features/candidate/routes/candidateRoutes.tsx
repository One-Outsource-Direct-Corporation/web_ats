import CandidateDashboard from "@/features/candidate/views/CandidateDashboard";
import CandidateRegister from "@/features/candidate/views/CandidateRegister";
import CandidateApplicationDetail from "@/features/candidate/views/CandidateApplicationDetail";
import CandidateOfferPage from "@/features/candidate/views/CandidateOfferPage";
import CandidateProfile from "@/features/candidate/views/CandidateProfile";
import CandidateAssessmentPage from "@/features/candidate/views/CandidateAssessmentPage";
import ProtectedRoutes from "@/features/auth/components/ProtectedRoutes";
import CandidateLayout from "@/features/candidate/components/CandidateLayout";

export const candidateRoutes = [
  {
    path: "candidate/register",
    element: <CandidateRegister />,
  },
  {
    path: "offer/:trackingCode",
    element: <CandidateOfferPage />,
  },
  {
    element: (
      <ProtectedRoutes allowedRoles={["candidate"]}>
        <CandidateLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "candidate/dashboard",
        element: <CandidateDashboard />,
      },
      {
        path: "candidate/applications/:id",
        element: <CandidateApplicationDetail />,
      },
      {
        path: "candidate/applications/:id/assessments",
        element: <CandidateAssessmentPage />,
      },
      {
        path: "candidate/profile",
        element: <CandidateProfile />,
      },
    ],
  },
];
