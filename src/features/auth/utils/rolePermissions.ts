/**
 * Role-based permissions configuration
 * Defines which roles have access to which features
 */

export type UserRole =
  | "manager"
  | "hiring_manager"
  | "human_resources_manager"
  | "general_manager"
  | "finance_manager"
  | "admin"
  | "hr"
  | "recruiter"
  | string;

export const MANAGER_DASHBOARD_POSITIONS_ROLES: UserRole[] = ["manager"];

export const RESTRICTED_MANAGER_ROLES: UserRole[] = [
  "hiring_manager",
  "human_resources_manager",
  "general_manager",
  "finance_manager",
];

export const isManagerDashboardOnlyRole = (
  role: string | undefined
): boolean => {
  if (!role) return false;
  return MANAGER_DASHBOARD_POSITIONS_ROLES.includes(role);
};

/**
 * Check if a user role is a restricted manager
 */
export const isRestrictedManager = (role: string | undefined): boolean => {
  if (!role) return false;
  return RESTRICTED_MANAGER_ROLES.includes(role);
};

/**
 * Get the default landing page for a user based on their role
 */
export const getDefaultLandingPage = (role: string | undefined): string => {
  if (isManagerDashboardOnlyRole(role)) {
    return "/dashboard";
  }

  if (isRestrictedManager(role)) {
    return "/positions";
  }

  return "/dashboard";
};

/**
 * Check if a user has access to a specific route
 */
export const canAccessRoute = (
  route: string,
  role: string | undefined
): boolean => {
  if (!role) return false;

  // Manager can only access dashboard and positions.
  if (isManagerDashboardOnlyRole(role)) {
    return (
      route === "/" ||
      route.startsWith("/dashboard") ||
      route.startsWith("/positions")
    );
  }

  // Restricted managers can only access base path, positions, and requests
  if (isRestrictedManager(role)) {
    return (
      route === "/" ||
      route.startsWith("/positions") ||
      route.startsWith("/requests")
    );
  }

  // All other roles have full access
  return true;
};

/**
 * Get filtered routes based on user role
 */
export const getAccessibleRoutes = (role: string | undefined) => {
  const allRoutes = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/job", label: "Applicants" },
    { path: "/positions", label: "Positions" },
    { path: "/requests", label: "Requests" },
    { path: "/library", label: "Library" },
  ];

  if (isManagerDashboardOnlyRole(role)) {
    return allRoutes.filter(
      (route) => route.path === "/dashboard" || route.path === "/positions"
    );
  }

  // If restricted manager, only return positions and requests
  if (isRestrictedManager(role)) {
    return allRoutes.filter(
      (route) => route.path === "/positions" || route.path === "/requests"
    );
  }

  // Return all routes for other roles
  return allRoutes;
};
