import Request from "../views/Request";

export const requestRoutes = [
  {
    path: "requests",
    children: [
      {
        index: true,
        element: <Request />,
      },
    ],
  },
];
