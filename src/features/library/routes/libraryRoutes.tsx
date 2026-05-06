import Library from "../views/Library";
import IEFTemplateLibrary from "../views/IEFTemplateLibrary";
import IEFTemplateEditor from "../views/IEFTemplateEditor";
import BusinessUnitLibrary from "../views/BusinessUnitLibrary";

export const libraryRoutes = [
  {
    path: "library",
    children: [
      {
        index: true,
        element: <Library />,
      },
      {
        path: "business-units",
        element: <BusinessUnitLibrary />,
      },
      {
        path: "ief-templates",
        children: [
          {
            index: true,
            element: <IEFTemplateLibrary />,
          },
          {
            path: "new",
            element: <IEFTemplateEditor />,
          },
          {
            path: ":templateId",
            element: <IEFTemplateEditor />,
          },
        ],
      },
    ],
  },
];
