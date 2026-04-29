import Library from "../views/Library";
import IEFTemplateLibrary from "../views/IEFTemplateLibrary";
import IEFTemplateEditor from "../views/IEFTemplateEditor";

export const libraryRoutes = [
  {
    path: "library",
    children: [
      {
        index: true,
        element: <Library />,
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
