import { useCallback, useState } from "react";
import { isAxiosError } from "axios";

import { careersService } from "../services/careers.service";
import type { CandidateApplicationTrackResponse } from "../types/jobApply.types";

const DEFAULT_ERROR_MESSAGE =
  "Unable to track your application right now. Please try again.";

interface UseApplicationTrackerResult {
  isLoading: boolean;
  error: string | null;
  data: CandidateApplicationTrackResponse | null;
  trackApplication: (trackingCode: string) => Promise<void>;
  clearResult: () => void;
}

export function useApplicationTracker(): UseApplicationTrackerResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CandidateApplicationTrackResponse | null>(
    null,
  );

  const trackApplication = useCallback(async (trackingCode: string) => {
    const normalizedTrackingCode = trackingCode.trim();

    if (!normalizedTrackingCode) {
      setError("Tracking code is required.");
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await careersService.trackCandidateApplication(
        normalizedTrackingCode,
      );
      setData(response);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const responseData = err.response?.data as
          | { error?: string; detail?: string }
          | undefined;

        setError(
          responseData?.error || responseData?.detail || DEFAULT_ERROR_MESSAGE,
        );
      } else if (err instanceof Error && err.message.trim()) {
        setError(err.message);
      } else {
        setError(DEFAULT_ERROR_MESSAGE);
      }

      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setError(null);
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    trackApplication,
    clearResult,
  };
}
