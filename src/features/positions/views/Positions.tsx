import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import FilterBar from "../components/FilterBar";
import JobListItem from "../components/JobListItem";
import { usePositions } from "../../../shared/hooks/usePositions";

export default function Positions() {
  const { positions, loading, error } = usePositions("active");

  // To do: Bring back the tabs functionality

  // const handleBulkAction = (action: string) => {
  //   switch (action) {
  //     case "delete":
  //       openDialog({
  //         title: "Move to Deleted",
  //         description:
  //           "Do you want to send the selected position/s to the Deleted tab?",
  //         onConfirm: handleMoveToDeleted,
  //         confirmLabel: "Yes",
  //         cancelLabel: "No",
  //         destructive: true,
  //       });
  //       break;
  //     case "open":
  //       openDialog({
  //         title: "Open Positions",
  //         description: "Do you want to open this position/s?",
  //         onConfirm: handleOpenPositions,
  //         confirmLabel: "Yes",
  //         cancelLabel: "No",
  //       });
  //       break;
  //     case "hold":
  //       openDialog({
  //         title: "Hold Positions",
  //         description: "Do you want to put this position/s on hold?",
  //         onConfirm: handleHoldPositions,
  //         confirmLabel: "Yes",
  //         cancelLabel: "No",
  //       });
  //       break;
  //     case "archive":
  //       openDialog({
  //         title: "Archive Positions",
  //         description: "Do you want to archive this position/s?",
  //         onConfirm: handleArchivePositions,
  //         confirmLabel: "Yes",
  //         cancelLabel: "No",
  //       });
  //       break;
  //     case "restore":
  //       openDialog({
  //         title: "Restore Positions",
  //         description: "Do you want to restore the selected position/s?",
  //         onConfirm: handleRestorePositions,
  //         confirmLabel: "Yes",
  //         cancelLabel: "No",
  //       });
  //       break;
  //     case "delete-permanent":
  //       openDialog({
  //         title: "Delete Permanently",
  //         description:
  //           "This action cannot be undone. Are you sure you want to permanently delete the selected position/s?",
  //         onConfirm: handleDeletePermanently,
  //         confirmLabel: "Delete Permanently",
  //         cancelLabel: "Cancel",
  //         destructive: true,
  //       });
  //       break;
  //   }
  // };

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
            <FilterBar />
          </div>
        </div>

        {/* Main content section */}
        <main className="flex-grow px-6 pt-[150px] pb-[80px] max-w-7xl mx-auto w-full">
          {loading && <LoadingComponent />}
          {error && (
            <div className="text-red-600 text-center">
              Error loading positions
            </div>
          )}
          {!loading && !error && positions.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              This tab is empty.
            </div>
          )}
          {!loading && !error && positions.length > 0 && (
            <div className="space-y-2">
              {positions.map((position) => (
                <JobListItem key={position.unique_id} posting={position} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
