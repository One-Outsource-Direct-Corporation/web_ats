import CandidateDashboard from "@/features/candidate/views/CandidateDashboard";
import CandidateRegister from "@/features/candidate/views/CandidateRegister";
import CandidateApplicationDetail from "@/features/candidate/views/CandidateApplicationDetail";
import ProtectedRoutes from "@/features/auth/components/ProtectedRoutes";

export const candidateRoutes = [
  {
    path: "candidate/register",
    element: <CandidateRegister />,
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
];
