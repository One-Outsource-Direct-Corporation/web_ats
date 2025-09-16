import IEForm from "../views/InterviewEvaluationFormPage";

export const interviewsRoutes = [
  {
    path: "/interviews",
    children: [
      {
        index: true,
        element: <IEForm />,
      },
    ],
  },
];
