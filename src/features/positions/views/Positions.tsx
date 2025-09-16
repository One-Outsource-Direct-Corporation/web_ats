import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FilterBar from "../components/FilterBar";
import { Navbar } from "@/components/reusables/Navbar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActionDialog from "../components/ActionDialog";
import { getDepartmentColor } from "../utils/departmentColor";
import { generateJobLink } from "../utils/jobUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Dummy data and types (move to a types.ts if needed)
import initialJobData from "../data/initialJobData";
import type { JobPosting } from "../types/jobTypes";
import {
  Pencil,
  ExternalLink,
  Trash2,
  Archive,
  Pause,
  RotateCcw,
  Unlock,
  User,
  Users2,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
// Removed stray bracket

export default function Positions() {
  const navigate = useNavigate();

  // Get current tab from URL path or default to 'drafts'
  const getCurrentTab = () => {
    const path = window.location.pathname;
    const tabFromPath = path.split("/positions/")[1] || "drafts";
    return tabFromPath;
  };

  const [currentTab, setCurrentTab] = useState(getCurrentTab());
  const [publishedSubTab, setPublishedSubTab] = useState<
    "all" | "Internal" | "External"
  >("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [showTypeDialog, setShowTypeDialog] = useState(false);

  // State for filter dropdowns
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("all");

  // State to hold all job postings, allowing modifications
  const [allPositions, setAllPositions] = useState(() => {
    // Initialize with generated data, ensuring published 'all' is correctly set
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
        all: [] as JobPosting[], // Explicitly type 'all' as an array of JobPosting
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

  // Dialog states for various actions
  // Single dialog state and config
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
  }>({
    title: "",
    description: "",
    onConfirm: () => {},
    confirmLabel: "Yes",
    cancelLabel: "No",
    destructive: false,
  });
  // Helper to open dialog with config
  const openDialog = (config: Partial<typeof dialogConfig>) => {
    setDialogConfig({
      ...dialogConfig,
      ...config,
    });
    setDialogOpen(true);
  };

  // Update current tab when URL changes
  useEffect(() => {
    const newTab = getCurrentTab();
    setCurrentTab(newTab);
    document.title = `Positions | ${
      newTab.charAt(0).toUpperCase() + newTab.slice(1).replace("-", " ")
    }`;
  }, [currentTab]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    navigate(`/positions/${value}`);
    setSelected([]); // Clear selection when changing tabs
    // Reset published subtab when changing main tabs
    if (value !== "published") {
      setPublishedSubTab("all");
    }
    document.title = `Positions | ${
      value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ")
    }`;
  };

  const getCurrentData = (): JobPosting[] => {
    if (currentTab === "published") {
      return allPositions.published?.[publishedSubTab] ?? [];
    }
    const tabData = allPositions[currentTab as keyof typeof allPositions];
    return Array.isArray(tabData) ? tabData : [];
  };

  const currentData: JobPosting[] = getCurrentData();

  const filteredPostings = currentData.filter((posting: JobPosting) =>
    posting.title.toLowerCase().includes(search.toLowerCase())
  );

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

  const moveSelectedJobs = (
    sourceTabName:
      | keyof typeof allPositions
      | "publishedInternal"
      | "publishedExternal",
    destinationTabName:
      | keyof typeof allPositions
      | "publishedInternal"
      | "publishedExternal"
      | "published"
  ) => {
    setAllPositions((prevPositions) => {
      const newPositions = JSON.parse(JSON.stringify(prevPositions)); // Deep copy to avoid direct mutation issues
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
        // This case is for when 'all' subtab is active in Published
        newPositions.published.Internal =
          newPositions.published.Internal.filter(
            (job: JobPosting) => !selectedJobIds.has(job.id)
          );
        newPositions.published.External =
          newPositions.published.External.filter(
            (job: JobPosting) => !selectedJobIds.has(job.id)
          );
      } else {
        // For other top-level tabs like 'drafts', 'on-hold', 'closed', 'archive', 'deleted'
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
          // Preserve original type if available, otherwise default to Internal
          const targetType = job.type || "Internal";
          const jobWithLink = {
            ...job,
            type: targetType,
            link: generateJobLink(job.title),
          };

          if (targetType === "Internal") {
            newPositions.published.Internal.push(jobWithLink);
          } else {
            // targetType === "External"
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
    setSelected([]); // Clear selection after action
  };

  // Handlers for specific dialogs
  const handleMoveToDeleted = () => {
    moveSelectedJobs(currentTab as keyof typeof allPositions, "deleted");
    setDialogOpen(false);
  };

  const handleOpenPositions = () => {
    moveSelectedJobs("on-hold", "published");
    setDialogOpen(false);
  };

  const handleArchivePositions = () => {
    let sourceTab:
      | keyof typeof allPositions
      | "publishedInternal"
      | "publishedExternal" = "published";
    if (publishedSubTab === "Internal") {
      sourceTab = "publishedInternal";
    } else if (publishedSubTab === "External") {
      sourceTab = "publishedExternal";
    } else if (publishedSubTab === "all") {
      sourceTab = "published";
    }
    moveSelectedJobs(sourceTab, "archive");
    setDialogOpen(false);
  };

  const handleHoldPositions = () => {
    let sourceTab:
      | keyof typeof allPositions
      | "publishedInternal"
      | "publishedExternal" = "published";
    if (publishedSubTab === "Internal") {
      sourceTab = "publishedInternal";
    } else if (publishedSubTab === "External") {
      sourceTab = "publishedExternal";
    } else if (publishedSubTab === "all") {
      sourceTab = "published";
    }
    moveSelectedJobs(sourceTab, "on-hold");
    setDialogOpen(false);
  };

  const handleRestorePositions = () => {
    moveSelectedJobs(currentTab as keyof typeof allPositions, "on-hold");
    setDialogOpen(false);
  };

  const handleDeletePermanently = () => {
    setAllPositions((prevPositions) => {
      const newPositions = { ...prevPositions };
      const remainingPostings = (newPositions.deleted as JobPosting[]).filter(
        (_, idx) => !selected.includes(idx)
      );
      newPositions.deleted = remainingPostings;
      return newPositions;
    });
    setSelected([]); // Clear selection after deletion
    setDialogOpen(false); // Close the dialog after deletion
  };

  const renderActionButton = (posting: JobPosting) => {
    // Only show default actions when no items are selected
    if (selected.length > 0) {
      return null;
    }
    switch (currentTab) {
      case "drafts":
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            onClick={() => navigate("/positions/create-new-position")}
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        );
      case "published":
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            // onClick removed: ShareModal and handler not available
          >
            <ExternalLink className="w-4 h-4 text-gray-500 hover:text-blue-600" />
          </div>
        );
      case "closed":
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            onClick={() => navigate("/positions/create-new-position")}
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        );
      default:
        return null;
    }
  };

  const renderRightContent = (posting: JobPosting, idx: number) => {
    // Only show default actions when no items are selected
    if (selected.length > 0) {
      return null;
    }

    return renderActionButton(posting);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-[100px] bg-gray-50">
        {" "}
        {/* Adjusted pt for fixed header */}
        {/* Fixed top filter/search section */}
        <div className="fixed top-[64px] left-0 right-0 z-20 bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
          <div className="max-w-7xl mx-auto space-y-3">
            <h1 className="text-3xl font-bold text-gray-800">Positions</h1>
            <p className="text-lg text-gray-700">
              Manages job openings and related information.
            </p>
            <FilterBar
              search={search}
              setSearch={setSearch}
              selectedOffice={selectedOffice}
              setSelectedOffice={setSelectedOffice}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              selectedEmploymentType={selectedEmploymentType}
              setSelectedEmploymentType={setSelectedEmploymentType}
              onAddNewPosition={() => setShowTypeDialog(true)}
            />
          </div>
        </div>
        {/* Main content section */}
        <main className="flex-grow px-6 pt-[150px] pb-[80px] max-w-7xl mx-auto w-full">
          <div className="flex items-center pb-2">
            <Tabs
              value={currentTab}
              onValueChange={handleTabChange}
              className="w-auto"
            >
              <TabsList className="flex gap-4 bg-transparent border-b-0">
                {[
                  "drafts",
                  "on-hold",
                  "published",
                  "closed",
                  "archive",
                  "deleted",
                ].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="relative px-2 pb-2 text-sm font-medium text-gray-500 data-[state=active]:text-blue-600"
                  >
                    {tab.charAt(0).toUpperCase() +
                      tab.slice(1).replace("-", " ")}
                    <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-blue-600 scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left" />
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          {currentTab === "published" && (
            <div className="flex items-center pb-2">
              <Tabs
                value={publishedSubTab}
                onValueChange={(value) =>
                  setPublishedSubTab(value as "all" | "Internal" | "External")
                }
                className="w-auto"
              >
                <TabsList className="flex gap-4 bg-transparent border-b-0 ml-4">
                  {["all", "Internal", "External"].map((subtab) => (
                    <TabsTrigger
                      key={subtab}
                      value={subtab}
                      className="relative px-2 pb-2 text-xs font-medium text-gray-400 data-[state=active]:text-blue-500"
                    >
                      {subtab.charAt(0).toUpperCase() + subtab.slice(1)}
                      <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-blue-500 scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left" />
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
          <div className="flex justify-between items-center pb-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
                  checked={
                    selected.length === filteredPostings.length &&
                    filteredPostings.length > 0
                  }
                  onChange={handleSelectAllToggle}
                />
                Select All
              </label>
            </div>
            {selected.length > 0 && (
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  {(currentTab === "drafts" ||
                    currentTab === "closed" ||
                    currentTab === "archive") && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() =>
                            openDialog({
                              title: "Move to Deleted",
                              description:
                                "Do you want to send the selected position/s to the Deleted tab?",
                              onConfirm: handleMoveToDeleted,
                              confirmLabel: "Yes",
                              cancelLabel: "No",
                              destructive: true,
                            })
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {currentTab === "on-hold" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-50"
                          onClick={() =>
                            openDialog({
                              title: "Open Positions",
                              description:
                                "Do you want to open this position/s?",
                              onConfirm: handleOpenPositions,
                              confirmLabel: "Yes",
                              cancelLabel: "No",
                            })
                          }
                        >
                          <Unlock className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {currentTab === "published" && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:bg-gray-50"
                            onClick={() =>
                              openDialog({
                                title: "Archive Positions",
                                description:
                                  "Do you want to send the selected position/s to the Archive Tab?",
                                onConfirm: handleArchivePositions,
                                confirmLabel: "Yes",
                                cancelLabel: "No",
                                destructive: true,
                              })
                            }
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Archive</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:bg-gray-50"
                            onClick={() =>
                              openDialog({
                                title: "Hold Positions",
                                description:
                                  "Do you want to send the selected position/s to the On Hold Tab?",
                                onConfirm: handleHoldPositions,
                                confirmLabel: "Yes",
                                cancelLabel: "No",
                              })
                            }
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hold</p>
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
                  {currentTab === "archive" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-50"
                          onClick={() =>
                            openDialog({
                              title: "Restore Positions",
                              description:
                                "Do you want to restore the selected position/s?",
                              onConfirm: handleRestorePositions,
                              confirmLabel: "Yes",
                              cancelLabel: "No",
                            })
                          }
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Restore</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {currentTab === "deleted" && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() =>
                              openDialog({
                                title: "Restore Positions",
                                description:
                                  "Do you want to restore the selected position/s?",
                                onConfirm: handleRestorePositions,
                                confirmLabel: "Yes",
                                cancelLabel: "No",
                              })
                            }
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Restore</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() =>
                              openDialog({
                                title: "Delete Permanently",
                                description: `Do you want to delete ${selected.length} jobs permanently?`,
                                onConfirm: handleDeletePermanently,
                                confirmLabel: "Yes",
                                cancelLabel: "No",
                                destructive: true,
                              })
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Permanently</p>
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
              </TooltipProvider>
            )}
          </div>
          {/* Postings */}
          <div className="space-y-2">
            {filteredPostings.length > 0 ? (
              filteredPostings.map((posting: JobPosting, idx: number) => (
                <Card
                  key={posting.id}
                  className="p-4 shadow-sm hover:shadow-md transition border rounded-md"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          className="mt-1 w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
                          checked={selected.includes(idx)}
                          onChange={() =>
                            setSelected((prev) =>
                              prev.includes(idx)
                                ? prev.filter((i) => i !== idx)
                                : [...prev, idx]
                            )
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-gray-800">
                            {posting.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={`${getDepartmentColor(
                              posting.department
                            )} text-xs`}
                          >
                            {posting.department}
                          </Badge>
                          {posting.status && (
                            <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                              {posting.status}
                            </Badge>
                          )}
                          {currentTab === "published" && posting.type && (
                            <Badge
                              className={`text-xs ${
                                posting.type === "Internal"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {posting.type}
                            </Badge>
                          )}
                          {currentTab === "deleted" && (
                            <div className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                              Deleted
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {posting.description.length > 100
                            ? posting.description.slice(0, 100) + "..."
                            : posting.description}
                        </p>
                      </div>
                    </div>
                    {renderRightContent(posting, idx)}
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                This tab is empty.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Single ActionDialog instance */}
      <ActionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogConfig.title}
        description={dialogConfig.description}
        onConfirm={() => {
          dialogConfig.onConfirm();
          setDialogOpen(false);
        }}
        confirmLabel={dialogConfig.confirmLabel}
        cancelLabel={dialogConfig.cancelLabel}
        destructive={dialogConfig.destructive}
      />
      <Dialog open={showTypeDialog} onOpenChange={setShowTypeDialog}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-blue-700 text-sm font-semibold">
              SELECT TYPE OF HIRING
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center gap-12 mt-6">
            {/* Internal Hiring */}
            <div
              className="flex flex-col items-center space-y-2 cursor-pointer group"
              onClick={() => navigate("/prf")}
            >
              <div className="w-16 h-16 rounded-full border border-gray-500 text-gray-600 flex items-center justify-center group-hover:border-blue-500 group-hover:text-blue-500">
                <User className="w-6 h-6" />
              </div>
              <span className="text-sm text-gray-600  font-medium group-hover:text-blue-500">
                Internal Hiring
              </span>
            </div>

            {/* Client */}
            <div
              className="flex flex-col items-center space-y-2 cursor-pointer group"
              onClick={() => navigate("/positions/create-new-position")}
            >
              <div className="w-16 h-16 rounded-full border border-gray-500 text-gray-600 group-hover:border-blue-500 group-hover:text-blue-500 flex items-center justify-center">
                <Users2 className="w-6 h-6" />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-blue-500 font-medium">
                Client
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
