/**
 * Role-based permissions configuration
 * Defines which roles have access to which features
 */

export type UserRole =
  | "hiring_manager"
  | "general_manager"
  | "finance_manager"
  | "admin"
  | "hr"
  | "recruiter"
  | string;

export const RESTRICTED_MANAGER_ROLES: UserRole[] = [
  "hiring_manager",
  "general_manager",
  "finance_manager",
];

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

  // Restricted managers can only access positions
  if (isRestrictedManager(role)) {
    return route.startsWith("/positions");
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

  // If restricted manager, only return positions and requests
  if (isRestrictedManager(role)) {
    return allRoutes.filter(
      (route) => route.path === "/positions" || route.path === "/requests"
    );
  }

  // Return all routes for other roles
  return allRoutes;
};
