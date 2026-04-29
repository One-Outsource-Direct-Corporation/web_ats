import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";

import { iefTemplateService } from "../services/iefTemplate.service";
import type { IefTemplateRecord } from "../types/iefTemplate.types";

export const useIefTemplatesQuery = () => {
  const axiosPrivate = useAxiosPrivate();
  const controllerRef = useRef<AbortController | null>(null);

  const [templates, setTemplates] = useState<IefTemplateRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchTemplates = useCallback(async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();

    try {
      setLoading(true);
      const response = await iefTemplateService.listTemplates({
        httpClient: axiosPrivate,
        signal: controllerRef.current.signal,
      });
      setTemplates(response);
    } catch (error: any) {
      if (error?.name !== "CanceledError") {
        console.error("Failed to fetch IEF templates", error);
      }
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    void fetchTemplates();

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [fetchTemplates]);

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return templates;
    }

    return templates.filter((template) => {
      const haystack = [
        template.name,
        template.description ?? "",
        template.sections?.map((section) => section.title ?? section.key ?? "").join(" ") ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [search, templates]);

  return {
    templates: filteredTemplates,
    rawTemplates: templates,
    loading,
    search,
    setSearch,
    refetch: fetchTemplates,
  };
};
