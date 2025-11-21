import { useState, useEffect, useRef, useCallback } from "react";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type { Assessment } from "../types/pipeline.types";

interface AssessmentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Assessment[];
}

interface UseAssessmentParams {
  templatesOnly?: boolean;
  pageSize?: number;
  initialSearch?: string;
}

export default function useAssessment(params?: UseAssessmentParams) {
  const {
    templatesOnly = false,
    pageSize = 20,
    initialSearch = "",
  } = params || {};

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>(initialSearch);
  const [totalCount, setTotalCount] = useState<number>(0);

  const axiosPrivate = useAxiosPrivate();
  const controllerRef = useRef<AbortController | null>(null);

  const fetchAssessments = useCallback(
    async (
      pageNum: number = 1,
      searchQuery: string = "",
      append: boolean = false
    ) => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      controllerRef.current = new AbortController();
      try {
        setLoading(true);
        const params: Record<string, any> = {
          page: pageNum,
          page_size: pageSize,
        };

        if (searchQuery) {
          params.search = searchQuery;
        }

        if (templatesOnly) {
          params.is_template = true;
        }

        const response = await axiosPrivate.get<AssessmentResponse>(
          `/api/assessment/`,
          {
            params,
            signal: controllerRef.current.signal,
          }
        );

        const newAssessments = response.data.results;

        setAssessments((prev) =>
          append ? [...prev, ...newAssessments] : newAssessments
        );
        setHasMore(!!response.data.next);
        setTotalCount(response.data.count);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          console.error("Error fetching assessments:", err);
        }
        controllerRef.current = null;
      } finally {
        setLoading(false);
      }
    },
    [axiosPrivate, pageSize, templatesOnly]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAssessments(nextPage, search, true);
    }
  }, [loading, hasMore, page, search, fetchAssessments]);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      setSearch(searchQuery);
      setPage(1);
      fetchAssessments(1, searchQuery, false);
    },
    [fetchAssessments]
  );

  const refetch = useCallback(() => {
    setPage(1);
    fetchAssessments(1, search, false);
  }, [search, fetchAssessments]);

  useEffect(() => {
    fetchAssessments(1, search, false);
  }, []);

  return {
    assessments,
    loading,
    hasMore,
    totalCount,
    search,
    loadMore,
    handleSearch,
    refetch,
  };
}

export function useCheckAssessment(assessments: Assessment[]) {
  function isAssessmentInList(id: number | string): boolean {
    return assessments.some((assessment) => {
      if (typeof id === "number") {
        return "id" in assessment && assessment.id === id;
      }
      return "tempId" in assessment && assessment.tempId === id;
    });
  }

  return { isAssessmentInList };
}
