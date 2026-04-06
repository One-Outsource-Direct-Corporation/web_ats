import { useState, useEffect, useRef, useCallback } from "react";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type {
  Assessment,
  AssessmentTemplate,
  FileI,
} from "../types/pipeline.types";

interface AssessmentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AssessmentTemplate[];
}

interface CreateTemplateInput {
  name: string;
  type: string;
  file: FileI | File | null;
}

interface FileUploadResponse {
  file?: {
    id?: number;
  };
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

  const [assessments, setAssessments] = useState<AssessmentTemplate[]>([]);
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
      append: boolean = false,
    ): Promise<AssessmentTemplate[]> => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      controllerRef.current = new AbortController();
      try {
        setLoading(true);
        const requestParams: Record<string, string | number> = {
          page: pageNum,
          page_size: pageSize,
        };

        if (searchQuery) {
          requestParams.search = searchQuery;
        }

        const endpoint = templatesOnly
          ? "/api/assessment/template/"
          : "/api/assessment/";

        const response = await axiosPrivate.get<AssessmentResponse>(endpoint, {
          params: requestParams,
          signal: controllerRef.current.signal,
        });

        const newAssessments = response.data.results;

        setAssessments((prev) =>
          append ? [...prev, ...newAssessments] : newAssessments,
        );
        setHasMore(!!response.data.next);
        setTotalCount(response.data.count);
        return newAssessments;
      } catch (err) {
        const error = err as { name?: string };
        if (error.name !== "CanceledError") {
          console.error("Error fetching assessments:", err);
        }
        controllerRef.current = null;
        return [];
      } finally {
        setLoading(false);
      }
    },
    [axiosPrivate, pageSize, templatesOnly],
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
    [fetchAssessments],
  );

  const refetch = useCallback(async () => {
    setPage(1);
    return fetchAssessments(1, search, false);
  }, [search, fetchAssessments]);

  const createTemplate = useCallback(
    async ({
      name,
      type,
      file,
    }: CreateTemplateInput): Promise<AssessmentTemplate | null> => {
      let fileId: number | null = null;

      if (file && typeof file === "object" && "id" in file) {
        fileId = file.id;
      } else if (file instanceof File) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const uploadResponse = await axiosPrivate.post<FileUploadResponse>(
          "/api/assessment/file-upload/",
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        fileId = uploadResponse.data?.file?.id ?? null;
      }

      const payload: Record<string, unknown> = {
        name,
        type,
      };

      if (fileId) {
        payload.file_id = fileId;
      }

      const response = await axiosPrivate.post<AssessmentTemplate>(
        "/api/assessment/template/",
        payload,
      );

      return response.data;
    },
    [axiosPrivate],
  );

  useEffect(() => {
    fetchAssessments(1, search, false);
  }, [fetchAssessments, search]);

  return {
    assessments,
    loading,
    hasMore,
    totalCount,
    search,
    loadMore,
    handleSearch,
    refetch,
    createTemplate,
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
