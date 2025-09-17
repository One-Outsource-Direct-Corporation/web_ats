import Dashboard from "../views/Dashboard";

export const dashboardRoutes = [
  {
    path: "dashboard",
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
];
