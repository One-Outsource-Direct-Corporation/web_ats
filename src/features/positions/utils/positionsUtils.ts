import type {
  TabType,
  PublishedSubTabType,
  PositionsData,
  JobPosting,
} from "../types/positionTypes";

/**
 * Get the formatted tab title for display
 */
export function getTabTitle(tab: TabType): string {
  return tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ");
}

/**
 * Get the current data based on tab and sub-tab
 */
export function getCurrentTabData(
  positions: PositionsData,
  currentTab: TabType,
  publishedSubTab: PublishedSubTabType
): JobPosting[] {
  if (currentTab === "published") {
    return positions.published?.[publishedSubTab] ?? [];
  }
  const tabData = positions[currentTab as keyof typeof positions];
  return Array.isArray(tabData) ? tabData : [];
}

/**
 * Filter postings based on search term
 */
export function filterPostings(
  postings: JobPosting[],
  searchTerm: string
): JobPosting[] {
  return postings.filter((posting) =>
    posting.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

/**
 * Get source tab name for published sub-tabs
 */
export function getSourceTabForPublished(
  publishedSubTab: PublishedSubTabType
): TabType | "publishedInternal" | "publishedExternal" {
  if (publishedSubTab === "Internal") {
    return "publishedInternal";
  } else if (publishedSubTab === "External") {
    return "publishedExternal";
  } else {
    return "published";
  }
}

/**
 * Check if all items are selected
 */
export function isAllSelected(selected: number[], totalItems: number): boolean {
  return selected.length === totalItems && totalItems > 0;
}

/**
 * Get selected indices for all items
 */
export function getAllIndices(totalItems: number): number[] {
  return Array.from({ length: totalItems }, (_, i) => i);
}

/**
 * Check if an item is selected
 */
export function isItemSelected(selected: number[], index: number): boolean {
  return selected.includes(index);
}

/**
 * Toggle item selection
 */
export function toggleItemSelection(
  selected: number[],
  index: number
): number[] {
  return selected.includes(index)
    ? selected.filter((i) => i !== index)
    : [...selected, index];
}

/**
 * Get the appropriate action button for a tab
 */
export function getTabAction(tab: TabType): {
  label: string;
  icon: string;
  action: string;
} | null {
  switch (tab) {
    case "drafts":
      return { label: "Edit", icon: "Pencil", action: "edit" };
    case "published":
      return { label: "Share", icon: "ExternalLink", action: "share" };
    case "closed":
      return { label: "Edit", icon: "Pencil", action: "edit" };
    default:
      return null;
  }
}

/**
 * Get available bulk actions for a tab
 */
export function getBulkActions(tab: TabType): Array<{
  label: string;
  icon: string;
  action: string;
  destructive?: boolean;
}> {
  switch (tab) {
    case "drafts":
    case "closed":
      return [
        {
          label: "Delete",
          icon: "Trash2",
          action: "delete",
          destructive: true,
        },
      ];
    case "on-hold":
      return [{ label: "Open", icon: "Unlock", action: "open" }];
    case "published":
      return [
        { label: "Hold", icon: "Pause", action: "hold" },
        { label: "Archive", icon: "Archive", action: "archive" },
      ];
    case "archive":
      return [{ label: "Restore", icon: "RotateCcw", action: "restore" }];
    case "deleted":
      return [
        { label: "Restore", icon: "RotateCcw", action: "restore" },
        {
          label: "Delete Permanently",
          icon: "Trash2",
          action: "delete-permanent",
          destructive: true,
        },
      ];
    default:
      return [];
  }
}
