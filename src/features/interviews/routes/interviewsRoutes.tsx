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
  {
    path: "/ieform",
    element: <IEForm />,
  },
  {
    path: "/job/:jobId/applicants/:candidateApplicationId/interviews/:interviewId/ief",
    element: <IEForm />,
  },
];
