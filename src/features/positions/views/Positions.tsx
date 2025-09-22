import FilterBar from "../components/FilterBar";
import ActionDialog from "../components/ActionDialog";
import PositionsTabs from "../components/PositionsTabs";
import JobListItem from "../components/JobListItem";
import BulkActions from "../components/BulkActions";
import SelectionControls from "../components/SelectionControls";
import HiringTypeDialog from "../components/HiringTypeDialog";
import { usePositions } from "../hooks/usePositions";
import { getSourceTabForPublished } from "../utils/positionsUtils";

export default function Positions() {
  const {
    // State
    currentTab,
    publishedSubTab,
    selected,
    showTypeDialog,
    filters,
    dialogOpen,
    dialogConfig,
    filteredPostings,

    // Actions
    setPublishedSubTab,
    setSelected,
    setShowTypeDialog,
    updateFilters,
    openDialog,
    closeDialog,
    handleSelectAllToggle,
    moveSelectedJobs,
    handleTabChange,
  } = usePositions();

  // Handlers for specific dialogs
  const handleMoveToDeleted = () => {
    moveSelectedJobs(currentTab, "deleted");
    closeDialog();
  };

  const handleOpenPositions = () => {
    moveSelectedJobs("on-hold", "published");
    closeDialog();
  };

  const handleArchivePositions = () => {
    const sourceTab = getSourceTabForPublished(publishedSubTab);
    moveSelectedJobs(sourceTab, "archive");
    closeDialog();
  };

  const handleHoldPositions = () => {
    const sourceTab = getSourceTabForPublished(publishedSubTab);
    moveSelectedJobs(sourceTab, "on-hold");
    closeDialog();
  };

  const handleRestorePositions = () => {
    moveSelectedJobs(currentTab, "on-hold");
    closeDialog();
  };

  const handleDeletePermanently = () => {
    // Implementation for permanent deletion
    closeDialog();
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "delete":
        openDialog({
          title: "Move to Deleted",
          description:
            "Do you want to send the selected position/s to the Deleted tab?",
          onConfirm: handleMoveToDeleted,
          confirmLabel: "Yes",
          cancelLabel: "No",
          destructive: true,
        });
        break;
      case "open":
        openDialog({
          title: "Open Positions",
          description: "Do you want to open this position/s?",
          onConfirm: handleOpenPositions,
          confirmLabel: "Yes",
          cancelLabel: "No",
        });
        break;
      case "hold":
        openDialog({
          title: "Hold Positions",
          description: "Do you want to put this position/s on hold?",
          onConfirm: handleHoldPositions,
          confirmLabel: "Yes",
          cancelLabel: "No",
        });
        break;
      case "archive":
        openDialog({
          title: "Archive Positions",
          description: "Do you want to archive this position/s?",
          onConfirm: handleArchivePositions,
          confirmLabel: "Yes",
          cancelLabel: "No",
        });
        break;
      case "restore":
        openDialog({
          title: "Restore Positions",
          description: "Do you want to restore the selected position/s?",
          onConfirm: handleRestorePositions,
          confirmLabel: "Yes",
          cancelLabel: "No",
        });
        break;
      case "delete-permanent":
        openDialog({
          title: "Delete Permanently",
          description:
            "This action cannot be undone. Are you sure you want to permanently delete the selected position/s?",
          onConfirm: handleDeletePermanently,
          confirmLabel: "Delete Permanently",
          cancelLabel: "Cancel",
          destructive: true,
        });
        break;
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen pt-[100px] bg-gray-50">
        {/* Fixed top filter/search section */}
        <div className="fixed top-[64px] left-0 right-0 z-20 bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
          <div className="max-w-7xl mx-auto space-y-3">
            <h1 className="text-3xl font-bold text-gray-800">Positions</h1>
            <p className="text-lg text-gray-700">
              Manages job openings and related information.
            </p>
            <FilterBar
              search={filters.search}
              setSearch={(search) => updateFilters({ search })}
              selectedOffice={filters.selectedOffice}
              setSelectedOffice={(selectedOffice) =>
                updateFilters({ selectedOffice })
              }
              selectedDepartment={filters.selectedDepartment}
              setSelectedDepartment={(selectedDepartment) =>
                updateFilters({ selectedDepartment })
              }
              selectedEmploymentType={filters.selectedEmploymentType}
              setSelectedEmploymentType={(selectedEmploymentType) =>
                updateFilters({ selectedEmploymentType })
              }
              onAddNewPosition={() => setShowTypeDialog(true)}
            />
          </div>
        </div>

        {/* Main content section */}
        <main className="flex-grow px-6 pt-[150px] pb-[80px] max-w-7xl mx-auto w-full">
          <PositionsTabs
            currentTab={currentTab}
            publishedSubTab={publishedSubTab}
            onTabChange={handleTabChange}
            onPublishedSubTabChange={setPublishedSubTab}
          />

          <div className="flex justify-between items-center pb-2">
            <SelectionControls
              selected={selected}
              totalItems={filteredPostings.length}
              onSelectAll={handleSelectAllToggle}
            />

            <BulkActions
              currentTab={currentTab}
              selectedCount={selected.length}
              onAction={handleBulkAction}
            />
          </div>

          {/* Job Postings */}
          <div className="space-y-2">
            {filteredPostings.length > 0 ? (
              filteredPostings.map((posting, idx) => (
                <JobListItem
                  key={posting.id}
                  posting={posting}
                  index={idx}
                  selected={selected}
                  currentTab={currentTab}
                  onSelectionChange={setSelected}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                This tab is empty.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <ActionDialog
        open={dialogOpen}
        onOpenChange={(open) => !open && closeDialog()}
        title={dialogConfig.title}
        description={dialogConfig.description}
        onConfirm={dialogConfig.onConfirm}
        confirmLabel={dialogConfig.confirmLabel}
        cancelLabel={dialogConfig.cancelLabel}
        destructive={dialogConfig.destructive}
      />

      <HiringTypeDialog
        open={showTypeDialog}
        onOpenChange={setShowTypeDialog}
      />
    </>
  );
}
