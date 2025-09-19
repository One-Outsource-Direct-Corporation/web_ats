interface JobData {
  id: number;
  title: string;
  icon: any;
  department: string;
  role: string;
  description: string;
  filters: string[];
  daysAgo: number;
  applicants: string;
  category: string;
  workType: string;
  workSetup: string;
}

interface AppState {
  currentComponent: string;
  selectedJob?: JobData;
  trackingCode?: string;
  searchQuery?: string;
  applicationData?: any;
  currentPath?: string;
}

export class AppNavigationManager {
  private static instance: AppNavigationManager;
  private appState: AppState = {
    currentComponent: "ApplicantLandingPage",
  };
  private stateChangeCallbacks: Array<(state: AppState) => void> = [];

  private constructor() {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("appNavigationState");
      if (stored) {
        this.appState = { ...this.appState, ...JSON.parse(stored) };
      }
    }
  }

  static getInstance(): AppNavigationManager {
    if (!AppNavigationManager.instance) {
      AppNavigationManager.instance = new AppNavigationManager();
    }
    return AppNavigationManager.instance;
  }

  // Subscribe to state changes
  subscribe(callback: (state: AppState) => void) {
    this.stateChangeCallbacks.push(callback);
    return () => {
      this.stateChangeCallbacks = this.stateChangeCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  // Notify all subscribers of state changes
  private notifyStateChange() {
    if (typeof window !== "undefined") {
      localStorage.setItem("appNavigationState", JSON.stringify(this.appState));
    }
    this.stateChangeCallbacks.forEach((callback) => callback(this.appState));
  }

  // Update browser URL without page reload
  private updateURL(path: string) {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
      this.appState.currentPath = path;
    }
  }

  // Navigation methods
  goToJobOpenings() {
    this.appState.currentComponent = "ApplicantLandingPage";
    this.updateURL("/jobopenings");
    this.notifyStateChange();
  }

  goToJobDescription(jobData: JobData) {
    const jobSlug = jobData.title.toLowerCase().replace(/\s+/g, "-");
    this.appState.currentComponent = "JobDescription";
    this.appState.selectedJob = jobData;
    this.updateURL(`/jobopenings/${jobSlug}`);
    this.notifyStateChange();
  }

  goToApplicationProcess(jobData: JobData) {
    const jobSlug = jobData.title.toLowerCase().replace(/\s+/g, "-");
    this.appState.currentComponent = "ApplicationProcess";
    this.appState.selectedJob = jobData;
    this.updateURL(`/jobopenings/${jobSlug}/apply`);
    this.notifyStateChange();
  }

  goToTracker(searchCode?: string) {
    this.appState.currentComponent = "Tracker";
    if (searchCode) {
      this.appState.searchQuery = searchCode;
      this.appState.trackingCode = searchCode;
    }
    this.updateURL("/applicationtracker");
    this.notifyStateChange();
  }

  goToDocuments() {
    this.appState.currentComponent = "Documents";
    this.updateURL("/documents");
    this.notifyStateChange();
  }

  // State getters
  getCurrentComponent() {
    return this.appState.currentComponent;
  }

  getCurrentJob() {
    return this.appState.selectedJob;
  }

  getTrackingCode() {
    return this.appState.trackingCode;
  }

  getSearchQuery() {
    return this.appState.searchQuery;
  }

  getAppState() {
    return { ...this.appState };
  }

  // Clear search query (useful for resetting search state)
  clearSearchQuery() {
    this.appState.searchQuery = undefined;
    this.notifyStateChange();
  }
}

export const appNavigation = AppNavigationManager.getInstance();
