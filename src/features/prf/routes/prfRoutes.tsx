import PRF from "@/Pages/PRF";

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
