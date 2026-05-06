import CandidateDashboard from "@/features/candidate/views/CandidateDashboard";
import CandidateRegister from "@/features/candidate/views/CandidateRegister";
import CandidateApplicationDetail from "@/features/candidate/views/CandidateApplicationDetail";
import CandidateOfferPage from "@/features/candidate/views/CandidateOfferPage";
import CandidateProfile from "@/features/candidate/views/CandidateProfile";
import CandidateAssessmentPage from "@/features/candidate/views/CandidateAssessmentPage";
import ProtectedRoutes from "@/features/auth/components/ProtectedRoutes";

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
    path: "candidate/dashboard",
    element: (
      <ProtectedRoutes allowedRoles={["candidate"]}>
        <CandidateDashboard />
      </ProtectedRoutes>
    ),
  },
  {
    path: "candidate/applications/:id",
    element: (
      <ProtectedRoutes allowedRoles={["candidate"]}>
        <CandidateApplicationDetail />
      </ProtectedRoutes>
    ),
  },
  {
    path: "candidate/applications/:id/assessments",
    element: (
      <ProtectedRoutes allowedRoles={["candidate"]}>
        <CandidateAssessmentPage />
      </ProtectedRoutes>
    ),
  },
  {
    path: "candidate/profile",
    element: (
      <ProtectedRoutes allowedRoles={["candidate"]}>
        <CandidateProfile />
      </ProtectedRoutes>
    ),
  },
];
