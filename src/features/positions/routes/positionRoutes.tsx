import Positions from "../views/Positions";
import CreateNewPosition from "../../positions-client/views/CreateNewPosition";

export const positionRoutes = [
  {
    path: "positions",
    children: [
      {
        index: true,
        element: <Positions />,
      },
      {
        path: "create-new-position",
        element: <CreateNewPosition />,
      },
    ],
  },
];
