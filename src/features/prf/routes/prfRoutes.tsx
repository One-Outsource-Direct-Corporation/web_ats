import PRFCreation from "@/Pages/PRFCreation";

export const prfRoutes = [
  {
    path: "prf",
    children: [
      {
        index: true,
        element: <PRFCreation />,
      },
    ],
  },
];
