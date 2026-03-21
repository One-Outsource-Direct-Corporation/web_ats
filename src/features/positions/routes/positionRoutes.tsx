import Positions from "../views/Positions";
import CreateExternalPosting from "../../external_posting/views/CreateExternalPosting";

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
        element: <CreateExternalPosting />,
      },
    ],
  },
];
