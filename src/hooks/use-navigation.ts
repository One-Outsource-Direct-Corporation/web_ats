"use client";

import { useState, useEffect } from "react";
import { appNavigation } from "@/shared/utils/navigation";

export const useAppNavigation = () => {
  const [appState, setAppState] = useState(appNavigation.getAppState());

  useEffect(() => {
    const unsubscribe = appNavigation.subscribe(setAppState);
    return unsubscribe;
  }, []);

  return {
    // Navigation methods
    goToJobOpenings: () => appNavigation.goToJobOpenings(),
    goToJobDescription: (jobData: any) =>
      appNavigation.goToJobDescription(jobData),
    goToApplicationProcess: (jobData: any) =>
      appNavigation.goToApplicationProcess(jobData),
    goToTracker: (searchCode?: string) => appNavigation.goToTracker(searchCode),
    goToDocuments: () => appNavigation.goToDocuments(),

    // State getters
    getCurrentComponent: () => appNavigation.getCurrentComponent(),
    getCurrentJob: () => appNavigation.getCurrentJob(),
    getTrackingCode: () => appNavigation.getTrackingCode(),
    getSearchQuery: () => appNavigation.getSearchQuery(),
    clearSearchQuery: () => appNavigation.clearSearchQuery(),

    // Current state
    appState,
  };
};
