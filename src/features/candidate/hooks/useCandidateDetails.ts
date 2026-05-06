import { useState, useEffect, useCallback } from "react";
import {
  candidateProfileService,
  type CandidateDetailsData,
  type CandidatePrefillData,
  type CandidateProfileConfig,
} from "../services/candidateProfile.service";

export function useCandidateDetails() {
  const [details, setDetails] = useState<CandidateDetailsData | null>(null);
  const [config, setConfig] = useState<CandidateProfileConfig | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    setLoadingDetails(true);
    setLoadingConfig(true);
    setError(null);

    // Fetch details and config independently so the form renders as soon as
    // details are available — config is only used for show/hide field logic.
    try {
      const detailsRes = await candidateProfileService.getDetails();
      setDetails(detailsRes);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load profile details.";
      setError(message);
    } finally {
      setLoadingDetails(false);
    }

    try {
      const configRes = await candidateProfileService.getConfig();
      setConfig(configRes);
    } catch {
      // Config failure is non-blocking — page falls back to showing all fields
      setConfig(null);
    } finally {
      setLoadingConfig(false);
    }
  }, []);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const saveDetails = useCallback(async (formData: FormData) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await candidateProfileService.updateDetails(formData);
      setDetails(updated);
      return updated;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save profile details.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    details,
    config,
    loading: loadingDetails,
    loadingConfig,
    saving,
    error,
    fetchDetails,
    saveDetails,
  };
}

export function useCandidatePrefill(jobId?: string | number) {
  const [prefill, setPrefill] = useState<CandidatePrefillData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrefill = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await candidateProfileService.getPrefill(jobId);
      setPrefill(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load prefill data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchPrefill();
  }, [fetchPrefill]);

  return { prefill, loading, error, refetch: fetchPrefill };
}
