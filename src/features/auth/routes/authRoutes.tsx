import Login from "../views/Login";

export const authRoutes = [
  {
    path: "login",
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
];
