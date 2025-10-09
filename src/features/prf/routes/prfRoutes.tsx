import PRF from "../views/PRF";

export const prfRoutes = [
  {
    path: "prf",
    children: [
      {
        index: true,
        element: <PRF />,
      },
    ],
  },
];
