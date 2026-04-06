import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { questionnaireTemplateService } from "../services/questionnaireTemplate.service";

const questionnaireTemplateDetailQueryKeys = {
  all: ["questionnaire-template", "detail"] as const,
  detail: (templateId: number | undefined) =>
    [...questionnaireTemplateDetailQueryKeys.all, templateId] as const,
};

export function useQuestionnaireTemplateDetail(
  templateId: number | undefined,
  enabled = true,
) {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: questionnaireTemplateDetailQueryKeys.detail(templateId),
    enabled: enabled && typeof templateId === "number",
    queryFn: ({ signal }) =>
      questionnaireTemplateService.detailResponse(
        { id: templateId as number },
        { httpClient: axiosPrivate, signal },
      ),
  });

  return {
    template: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
