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
  | "candidate"
  | "supervisor"
  | "human_resources"
  | string;

export const MANAGER_DASHBOARD_POSITIONS_ROLES: UserRole[] = ["manager"];

export const RESTRICTED_MANAGER_ROLES: UserRole[] = [
  "hiring_manager",
  "human_resources_manager",
  "general_manager",
  "finance_manager",
];

// Roles that should be allowed to see the Applicants tab
export const APPLICANTS_VISIBLE_ROLES: UserRole[] = [
  "manager",
  "general_manager",
  "finance_manager",
  "human_resources_manager",
  "supervisor",
];

export const CANDIDATE_ROLE: UserRole = "candidate";

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
 * Check if a user role is a candidate
 */
export const isCandidate = (role: string | undefined): boolean => {
  if (!role) return false;
  return role === CANDIDATE_ROLE;
};

/**
 * Get the default landing page for a user based on their role
 */
export const getDefaultLandingPage = (role: string | undefined): string => {
  if (isCandidate(role)) {
    return "/candidate/dashboard";
  }

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

  // Candidates can only access candidate routes and public pages
  if (isCandidate(role)) {
    return (
      route === "/" ||
      route.startsWith("/candidate") ||
      route.startsWith("/jobs") ||
      route.startsWith("/careers") ||
      route === "/track" ||
      route === "/login" ||
      route === "/logout"
    );
  }

  // Manager can only access dashboard and positions.
  if (isManagerDashboardOnlyRole(role)) {
    return (
      route === "/" ||
      route.startsWith("/dashboard") ||
      route.startsWith("/positions") ||
      route.startsWith("/job")
    );
  }

  // Restricted managers can only access base path, positions, and requests
  if (isRestrictedManager(role)) {
    return (
      route === "/" ||
      route.startsWith("/positions") ||
      route.startsWith("/requests") ||
      route.startsWith("/job")
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

  if (isCandidate(role)) {
    return []; // Candidates don't see HR nav routes
  }

  if (isManagerDashboardOnlyRole(role)) {
    return allRoutes.filter(
      (route) =>
        route.path === "/dashboard" ||
        route.path === "/positions" ||
        route.path === "/job"
    );
  }

  // If restricted manager, only return positions and requests
  if (isRestrictedManager(role)) {
    return allRoutes.filter(
      (route) =>
        route.path === "/positions" ||
        route.path === "/requests" ||
        route.path === "/job"
    );
  }

  // Return all routes for other roles
  return allRoutes;
};
