import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type {
  TabType,
  PublishedSubTabType,
  PositionsData,
  FilterState,
  DialogConfig,
  PositionsState,
  PositionsActions,
  JobPosting,
} from "../types/jobTypes";
import initialJobData from "../data/initialJobData";
import { generateJobLink } from "../utils/jobUtils";

export function usePositions(): PositionsState & PositionsActions {
  const navigate = useNavigate();

  // Get current tab from URL path or default to 'drafts'
  const getCurrentTab = (): TabType => {
    const path = window.location.pathname;
    const tabFromPath = (path.split("/positions/")[1] as TabType) || "drafts";
    return tabFromPath;
  };

  // Initialize state
  const [currentTab, setCurrentTab] = useState<TabType>(getCurrentTab());
  const [publishedSubTab, setPublishedSubTab] =
    useState<PublishedSubTabType>("all");
  const [selected, setSelected] = useState<number[]>([]);
  const [showTypeDialog, setShowTypeDialog] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    selectedOffice: "all",
    selectedDepartment: "all",
    selectedEmploymentType: "all",
  });

  // Positions data state
  const [positions, setPositions] = useState<PositionsData>(() => {
    const generated = {
      drafts: initialJobData.drafts,
      "on-hold": initialJobData["on-hold"],
      published: {
        Internal: initialJobData.published.Internal.map((job) => ({
          ...job,
          link: generateJobLink(job.title),
        })),
        External: initialJobData.published.External.map((job) => ({
          ...job,
          link: generateJobLink(job.title),
        })),
        all: [] as JobPosting[],
      },
      closed: initialJobData.closed,
      archive: initialJobData.archive,
      deleted: initialJobData.deleted,
    };
    generated.published.all = [
      ...generated.published.Internal,
      ...generated.published.External,
    ];
    return generated;
  });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    title: "",
    description: "",
    onConfirm: () => {},
    confirmLabel: "Yes",
    cancelLabel: "No",
    destructive: false,
  });

  // Update current tab when URL changes
  useEffect(() => {
    const newTab = getCurrentTab();
    setCurrentTab(newTab);
    document.title = `Positions | ${
      newTab.charAt(0).toUpperCase() + newTab.slice(1).replace("-", " ")
    }`;
  }, []);

  // Helper to open dialog with config
  const openDialog = (config: Partial<DialogConfig>) => {
    setDialogConfig({
      ...dialogConfig,
      ...config,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Update filters
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    const tabValue = value as TabType;
    setCurrentTab(tabValue);
    navigate(`/positions/${value}`);
    setSelected([]);
    if (value !== "published") {
      setPublishedSubTab("all");
    }
    document.title = `Positions | ${
      value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ")
    }`;
  };

  // Get current data based on tab
  const getCurrentData = (): JobPosting[] => {
    if (currentTab === "published") {
      return positions.published?.[publishedSubTab] ?? [];
    }
    const tabData = positions[currentTab as keyof typeof positions];
    return Array.isArray(tabData) ? tabData : [];
  };

  const currentData: JobPosting[] = getCurrentData();

  const filteredPostings = currentData.filter((posting: JobPosting) =>
    posting.title.toLowerCase().includes(filters.search.toLowerCase())
  );

  // Handle select all toggle
  const handleSelectAllToggle = () => {
    if (
      selected.length === filteredPostings.length &&
      filteredPostings.length > 0
    ) {
      setSelected([]);
    } else {
      setSelected(filteredPostings.map((_, idx) => idx));
    }
  };

  // Move selected jobs between tabs
  const moveSelectedJobs = (
    sourceTabName: TabType | "publishedInternal" | "publishedExternal",
    destinationTabName:
      | TabType
      | "publishedInternal"
      | "publishedExternal"
      | "published"
  ) => {
    setPositions((prevPositions) => {
      const newPositions = JSON.parse(JSON.stringify(prevPositions));
      const selectedJobsToMove: JobPosting[] = selected.map(
        (idx) => filteredPostings[idx]
      );
      const selectedJobIds = new Set(selectedJobsToMove.map((job) => job.id));

      // Remove selected jobs from their original source arrays
      if (sourceTabName === "publishedInternal") {
        newPositions.published.Internal =
          newPositions.published.Internal.filter(
            (job: JobPosting) => !selectedJobIds.has(job.id)
          );
      } else if (sourceTabName === "publishedExternal") {
        newPositions.published.External =
          newPositions.published.External.filter(
            (job: JobPosting) => !selectedJobIds.has(job.id)
          );
      } else if (sourceTabName === "published") {
        newPositions.published.Internal =
          newPositions.published.Internal.filter(
            (job: JobPosting) => !selectedJobIds.has(job.id)
          );
        newPositions.published.External =
          newPositions.published.External.filter(
            (job: JobPosting) => !selectedJobIds.has(job.id)
          );
      } else {
        if (Array.isArray(newPositions[sourceTabName])) {
          newPositions[sourceTabName] = (
            newPositions[sourceTabName] as JobPosting[]
          ).filter((job: JobPosting) => !selectedJobIds.has(job.id));
        }
      }

      // Add selected jobs to the destination tab
      if (
        destinationTabName === "publishedInternal" ||
        destinationTabName === "publishedExternal" ||
        destinationTabName === "published"
      ) {
        selectedJobsToMove.forEach((job) => {
          const targetType = job.type || "Internal";
          const jobWithLink = {
            ...job,
            type: targetType,
            link: generateJobLink(job.title),
          };

          if (targetType === "Internal") {
            newPositions.published.Internal.push(jobWithLink);
          } else {
            newPositions.published.External.push(jobWithLink);
          }
        });
      } else if (
        destinationTabName === "deleted" ||
        destinationTabName === "archive" ||
        destinationTabName === "on-hold"
      ) {
        newPositions[destinationTabName] = [
          ...(newPositions[destinationTabName] as JobPosting[]),
          ...selectedJobsToMove,
        ];
      }

      // Re-calculate the 'all' sub-tab for published
      newPositions.published.all = [
        ...newPositions.published.Internal,
        ...newPositions.published.External,
      ];

      return newPositions;
    });
    setSelected([]);
  };

  return {
    // State
    currentTab,
    publishedSubTab,
    selected,
    showTypeDialog,
    filters,
    positions,
    dialogOpen,
    dialogConfig,

    // Computed values
    currentData,
    filteredPostings,

    // Actions
    setCurrentTab,
    setPublishedSubTab,
    setSelected,
    setShowTypeDialog,
    updateFilters,
    setPositions,
    openDialog,
    closeDialog,
    handleSelectAllToggle,
    moveSelectedJobs,
    handleTabChange,
  };
}
