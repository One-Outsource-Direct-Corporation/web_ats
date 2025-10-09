"use client";

import { useState, useEffect } from "react";
import { appNavigation } from "@/shared/utils/navigation";

// Import your components with correct paths
import ApplicantLandingPage from "@/components/pages/applicantview/applicantslandingpage";
import JobDescription from "@/components/pages/applicantview/jobdescription";
import ApplicationProcess from "@/components/pages/applicantview/applicationprocess";
import Tracker from "@/components/pages/applicantview/tracker";
import Documents from "@/components/pages/applicantview/Documents";

export default function MainApp() {
  const [currentComponent, setCurrentComponent] = useState(
    "ApplicantLandingPage"
  );
  const [appState, setAppState] = useState(appNavigation.getAppState());

  useEffect(() => {
    // Subscribe to navigation state changes
    const unsubscribe = appNavigation.subscribe((state) => {
      setCurrentComponent(state.currentComponent);
      setAppState(state);
    });

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname;

      if (path === "/jobopenings") {
        appNavigation.goToJobOpenings();
      } else if (path === "/applicationtracker") {
        appNavigation.goToTracker();
      } else if (path === "/documents") {
        appNavigation.goToDocuments();
      } else if (path.startsWith("/jobopenings/") && path.endsWith("/apply")) {
        // Handle application process route
        const currentJob = appNavigation.getCurrentJob();
        if (currentJob) {
          appNavigation.goToApplicationProcess(currentJob);
        }
      } else if (path.startsWith("/jobopenings/")) {
        // Handle job description route
        const currentJob = appNavigation.getCurrentJob();
        if (currentJob) {
          appNavigation.goToJobDescription(currentJob);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      unsubscribe();
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Render the appropriate component based on current state
  const renderCurrentComponent = () => {
    switch (currentComponent) {
      case "ApplicantLandingPage":
        return <ApplicantLandingPage />;
      case "JobDescription":
        return <JobDescription />;
      case "ApplicationProcess":
        return <ApplicationProcess />;
      case "Tracker":
        return <Tracker />;
      case "Documents":
        return <Documents />;
      default:
        return <ApplicantLandingPage />;
    }
  };

  return <div className="min-h-screen">{renderCurrentComponent()}</div>;
}
