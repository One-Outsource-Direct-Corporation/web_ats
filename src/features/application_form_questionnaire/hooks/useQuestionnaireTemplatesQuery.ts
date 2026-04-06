import { useCallback, useEffect, useRef, useState } from "react";

import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";

import { questionnaireTemplateService } from "../services/questionnaireTemplate.service";
import type { QuestionnaireTemplate } from "../types/questionnaireTemplate.types";

interface UseQuestionnaireTemplatesQueryParams {
  pageSize?: number;
  initialSearch?: string;
  debounceMs?: number;
}

export const useQuestionnaireTemplatesQuery = (
  params?: UseQuestionnaireTemplatesQueryParams,
) => {
  const pageSize = params?.pageSize ?? 10;
  const initialSearch = params?.initialSearch ?? "";
  const debounceMs = params?.debounceMs ?? 300;

  const axiosPrivate = useAxiosPrivate();
  const controllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [templates, setTemplates] = useState<QuestionnaireTemplate[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = useCallback(
    async (pageNum: number, searchQuery: string, append: boolean) => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();

      try {
        setLoading(true);
        const response = await questionnaireTemplateService.listResponse(
          {
            page: pageNum,
            pageSize,
            search: searchQuery,
          },
          {
            httpClient: axiosPrivate,
            signal: controllerRef.current.signal,
          },
        );

        setTemplates((prev) =>
          append ? [...prev, ...response.results] : response.results,
        );
        setHasMore(Boolean(response.next));
        setTotalCount(response.count);
      } catch (error: any) {
        if (error?.name !== "CanceledError") {
          console.error("Failed to fetch questionnaire templates", error);
        }
      } finally {
        setLoading(false);
      }
    },
    [axiosPrivate, pageSize],
  );

  const loadMore = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }

    const nextPage = page + 1;
    setPage(nextPage);
    void fetchTemplates(nextPage, search, true);
  }, [fetchTemplates, hasMore, loading, page, search]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        void fetchTemplates(1, value, false);
      }, debounceMs);
    },
    [debounceMs, fetchTemplates],
  );

  const refetch = useCallback(() => {
    setPage(1);
    void fetchTemplates(1, search, false);
  }, [fetchTemplates, search]);

  useEffect(() => {
    void fetchTemplates(1, search, false);

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    templates,
    search,
    loading,
    hasMore,
    totalCount,
    loadMore,
    handleSearch,
    refetch,
  };
};
