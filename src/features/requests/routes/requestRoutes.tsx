import Request from "../views/Request";
import EditRequestItem from "../views/EditRequestItem";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isRestrictedManager } from "@/features/auth/utils/rolePermissions";
import ManagerRequest from "../views/ManagerRequest";
import ManagersView from "@/features/prf/views/ManagersView";

// Wrapper component to handle // Wrapper component to handle conditional rendering
const RequestIndex = () => {
  const { user } = useAuth();
  return isRestrictedManager(user?.role) ? <ManagerRequest /> : <Request />;
};

export const requestRoutes = [
  {
    path: "requests",
    children: [
      {
        index: true,
        element: <RequestIndex />,
      },
      {
        path: "manager/:positionId",
        element: <ManagersView />,
      },
      {
        path: "edit/:type/:id",
        element: <EditRequestItem />,
      },
    ],
  },
];
