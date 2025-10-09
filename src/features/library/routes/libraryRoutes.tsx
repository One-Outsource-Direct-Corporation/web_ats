import Library from "../views/Library";

export const libraryRoutes = [
  {
    path: "library",
    children: [
      {
        index: true,
        element: <Library />,
      },
    ],
  },
];
