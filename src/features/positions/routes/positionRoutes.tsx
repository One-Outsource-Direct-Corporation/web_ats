import Positions from "../views/Positions";

export const positionRoutes = [
  {
    path: "positions",
    children: [
      {
        index: true,
        element: <Positions />,
      },
      // {
      //   path: "create-new-position",
      //   element: <CreateExternalPosting />,
      // },
    ],
  },
];
