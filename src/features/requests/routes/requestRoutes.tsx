import Request from "../views/Request";
import EditRequestItem from "../views/EditRequestItem";

export const requestRoutes = [
  {
    path: "requests",
    children: [
      {
        index: true,
        element: <Request />,
      },
      {
        path: "edit/:type/:id",
        element: <EditRequestItem />,
      },
    ],
  },
];
