import Login from "../views/Login";

export const authRoutes = [
  {
    path: "/",
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
];
