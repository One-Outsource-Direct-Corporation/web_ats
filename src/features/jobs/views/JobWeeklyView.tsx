import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  ArrowLeft,
  LayoutGrid,
  List,
  Clock,
  Calendar,
  MapPin,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ApplicantCard } from "../components/ApplicantCard";
import { StageSection } from "../components/StageSection";
import { Sidebar } from "../components/Sidebar";
import type { Applicant, StageConfig } from "../types/kanban.types";

export default function JobWeeklyView() {
  const navigate = useNavigate();
  const { jobtitle } = useParams<{ jobtitle: string }>();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewMode] = useState<"grid" | "list">("grid");
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(
    new Set()
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // All stage data combined
  const [allColumns, setAllColumns] = useState<{
    [key: string]: Applicant[];
  }>({
    // Stage 1 columns
    "resume-screening": [
      { id: "1", name: "Rosa Bumbay", time: "1h ago", rating: 0 },
      { id: "2", name: "Maria Batumbakal", time: "1h ago", rating: 0 },
      { id: "5", name: "Jhonny Bravo", time: "3h ago", rating: 0 },
      { id: "6", name: "RJ Oremimo", time: "Dec 3", rating: 0 },
      { id: "7", name: "Sung Jin Woo", time: "Dec 1", rating: 0 },
    ],
    "phone-call": [
      { id: "3", name: "Joseph Adams", time: "7h ago", rating: 0 },
      { id: "8", name: "Brian Martinez", time: "1d ago", rating: 0 },
      { id: "9", name: "Sarah Johnson", time: "Nov 30", rating: 0 },
      { id: "10", name: "Sarah Davis", time: "Nov 28", rating: 0 },
    ],
    shortlisted: [
      { id: "4", name: "Joseph Adams", time: "2d ago", rating: 0 },
      { id: "11", name: "Brian Martinez", time: "Nov 29", rating: 0 },
      { id: "12", name: "Sarah Johnson", time: "Nov 30", rating: 0 },
      { id: "13", name: "Sarah Davis", time: "Nov 28", rating: 0 },
    ],
    // Stage 2 columns
    "initial-interview": [
      { id: "s2-1", name: "Joseph Santos", time: "1h ago", rating: 0 },
      { id: "s2-2", name: "Virla Getalado", time: "1h ago", rating: 0 },
    ],
    assessment: [
      { id: "s2-3", name: "Kyle Maybury", time: "1h ago", rating: 0 },
    ],
    "final-interview": [
      { id: "s2-4", name: "Joseph Adams", time: "7h ago", rating: 0 },
      { id: "s2-5", name: "Brian Martinez", time: "5h ago", rating: 0 },
      { id: "s2-6", name: "Sarah Johnson", time: "Nov 30", rating: 0 },
      { id: "s2-7", name: "Sarah Davis", time: "Nov 28", rating: 0 },
    ],
    // Stage 3 columns
    "job-offer": [
      { id: "s3-1", name: "Kyle Maybury", time: "1h ago", rating: 0 },
      { id: "s3-2", name: "Clara Lopez", time: "1h ago", rating: 0 },
      { id: "s3-3", name: "John Clark", time: "4h ago", rating: 0 },
      { id: "s3-4", name: "John Clark", time: "Dec 5", rating: 0 },
      { id: "s3-5", name: "Brian Harris", time: "Dec 1", rating: 0 },
    ],
    "job-offer-finalization": [
      { id: "s3-6", name: "Kyle Maybury", time: "1h ago", rating: 0 },
      { id: "s3-7", name: "Clara Lopez", time: "1h ago", rating: 0 },
      { id: "s3-8", name: "John Clark", time: "4h ago", rating: 0 },
    ],
    onboarding: [
      { id: "s3-9", name: "Joseph Adams", time: "7h ago", rating: 0 },
      { id: "s3-10", name: "Brian Martinez", time: "5h ago", rating: 0 },
      { id: "s3-11", name: "Sarah Johnson", time: "Nov 30", rating: 0 },
      { id: "s3-12", name: "Sarah Davis", time: "Nov 28", rating: 0 },
    ],
    warm: [
      { id: "s3-13", name: "Christian Edwards", time: "1h ago", rating: 0 },
      { id: "s3-14", name: "Clara Lopez", time: "1h ago", rating: 0 },
      { id: "s3-15", name: "John Clark", time: "4h ago", rating: 0 },
    ],
    failed: [
      { id: "s3-16", name: "Joseph Adams", time: "1h ago", rating: 0 },
      { id: "s3-17", name: "Brian Martinez", time: "3h ago", rating: 0 },
      { id: "s3-18", name: "Sarah Johnson", time: "Nov 30", rating: 0 },
    ],
  });

  const stageConfigs: StageConfig[] = [
    {
      title: "STAGE 01 - HR Interview",
      columns: [
        { title: "Resume Screening", id: "resume-screening" },
        { title: "Phone-Call Interview", id: "phone-call" },
        { title: "Shortlisted", id: "shortlisted" },
      ],
      isMultiRow: false,
    },
    {
      title: "STAGE 02 - Hiring Manager/Client",
      columns: [
        { title: "Initial Interview", id: "initial-interview" },
        { title: "Assessment", id: "assessment" },
        { title: "Final Interview", id: "final-interview" },
      ],
      isMultiRow: false,
    },
    {
      title: "STAGE 03",
      columns: [
        { title: "For Job Offer", id: "job-offer" },
        { title: "Job Offer & Finalization", id: "job-offer-finalization" },
        { title: "Onboarding", id: "onboarding" },
        { title: "Warm", id: "warm" },
        { title: "Failed", id: "failed" },
      ],
      isMultiRow: true,
    },
  ];

  const toTitleCase = (str: string) =>
    str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const formatJobTitle = (slug?: string) => {
    if (!slug) return "Unknown Job";

    const titleMap: { [key: string]: string } = {
      projectmanager: "Project Manager",
      socialcontentmanager: "Social Content Manager",
      senioruiuxdesigner: "Senior UI/UX Designer",
      leaddeveloper: "Lead Developer",
      customersupport: "Customer Support",
      qaengineer: "QA Engineer",
      humanresourcescoordinator: "Human Resources Coordinator",
      operationsmanager: "Operations Manager",
      socialmediamanager: "Social Media Manager",
      marketingspecialist: "Marketing Specialist",
    };

    const normalizedSlug = slug.toLowerCase().replace(/\s+/g, "");
    return titleMap[normalizedSlug] || toTitleCase(slug);
  };

  const resolvedJobTitle = formatJobTitle(jobtitle);

  useEffect(() => {
    document.title = `${resolvedJobTitle} - Applicants`;
  }, [resolvedJobTitle]);

  const findContainer = (id: string) => {
    if (id in allColumns) {
      return id;
    }
    return Object.keys(allColumns).find((key) =>
      allColumns[key].find((item) => item.id === id)
    );
  };

  const getActiveApplicant = () => {
    if (!activeId) return null;
    for (const items of Object.values(allColumns)) {
      const applicant = items.find((item) => item.id === activeId);
      if (applicant) return applicant;
    }
    return null;
  };

  const handleLongPress = (applicantId: string) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedApplicants(new Set([applicantId]));
    } else {
      handleToggleSelect(applicantId);
    }
  };

  const handleToggleSelect = (applicantId: string) => {
    const newSelected = new Set(selectedApplicants);
    if (newSelected.has(applicantId)) {
      newSelected.delete(applicantId);
    } else {
      newSelected.add(applicantId);
    }
    setSelectedApplicants(newSelected);

    if (newSelected.size === 0) {
      setIsSelectionMode(false);
    }
  };

  const handleColumnClick = (targetColumnId: string) => {
    if (selectedApplicants.size === 0) return;

    const newColumns = { ...allColumns };
    const selectedApplicantsList: Applicant[] = [];

    // Remove selected applicants from their current columns
    Object.keys(newColumns).forEach((columnId) => {
      newColumns[columnId] = newColumns[columnId].filter((applicant) => {
        if (selectedApplicants.has(applicant.id)) {
          selectedApplicantsList.push(applicant);
          return false;
        }
        return true;
      });
    });

    // Add selected applicants to target column
    newColumns[targetColumnId] = [
      ...newColumns[targetColumnId],
      ...selectedApplicantsList,
    ];

    setAllColumns(newColumns);
    setSelectedApplicants(new Set());
    setIsSelectionMode(false);
  };

  const handleClearSelection = () => {
    setSelectedApplicants(new Set());
    setIsSelectionMode(false);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) return;

    const activeItems = allColumns[activeContainer];
    const overItems = allColumns[overContainer];

    const activeIndex = activeItems.findIndex((item) => item.id === activeId);
    const activeItem = activeItems[activeIndex];

    if (!activeItem) return;

    setAllColumns({
      ...allColumns,
      [activeContainer]: activeItems.filter((item) => item.id !== activeId),
      [overContainer]: [...overItems, activeItem],
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const items = allColumns[activeContainer];
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === overId);

      if (oldIndex !== newIndex) {
        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);

        setAllColumns({
          ...allColumns,
          [activeContainer]: newItems,
        });
      }
    }
  };

  const activeApplicant = getActiveApplicant();
  const totalApplicants = Object.values(allColumns).reduce(
    (sum, col) => sum + col.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-[100px]">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="w-full space-y-6">
          {/* Mobile Selection Bar */}
          {isSelectionMode && (
            <div className="lg:hidden fixed top-16 left-0 right-0 bg-blue-600 text-white p-3 z-50 flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedApplicants.size} applicant
                {selectedApplicants.size !== 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-75">Tap column to move</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="text-white hover:bg-blue-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Header */}
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/job/${jobtitle}`)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-3xl font-bold text-gray-800">
                  {resolvedJobTitle}
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={
                    viewMode === "grid" ? "text-black" : "text-blue-800"
                  }
                >
                  <LayoutGrid className="h-4 w-4 text-blue-800" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigate(`/job/${jobtitle}`);
                  }}
                  className={
                    viewMode === "list" ? "text-black" : "text-gray-600"
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Job Info Display */}
            <div className="bg-white border rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">Full Time</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">Dec 9</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">Onsite</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">
                    Total applicants: {totalApplicants}
                  </span>
                </div>
              </div>
            </div>

            {/* Search */}
            <div>
              <Input placeholder="Search" className="max-w-md bg-gray-100" />
            </div>

            <hr />

            {/* Main Content and Sidebar Container */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Content */}
              <div className="flex-1">
                <div className="space-y-6">
                  {/* Mobile Instructions */}
                  {!isSelectionMode && (
                    <div className="lg:hidden bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>Mobile tip:</strong> Long press on any applicant
                        to start selection mode. Then long press additional
                        applicants to select multiple, and tap a column to move
                        them all there.
                      </p>
                    </div>
                  )}

                  {/* Drag and Drop Context for all stages */}
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                  >
                    {/* All Stages Stacked Vertically */}
                    <div className="space-y-8">
                      {stageConfigs.map((stage, index) => (
                        <StageSection
                          key={index}
                          title={stage.title}
                          columns={stage.columns}
                          applicantColumns={allColumns}
                          isMultiRow={stage.isMultiRow}
                          selectedApplicants={selectedApplicants}
                          isSelectionMode={isSelectionMode}
                          onLongPress={handleLongPress}
                          onToggleSelect={handleToggleSelect}
                          onColumnClick={handleColumnClick}
                          navigate={navigate}
                          jobtitle={jobtitle}
                        />
                      ))}
                    </div>

                    <DragOverlay>
                      {activeApplicant ? (
                        <ApplicantCard {...activeApplicant} isDragging={true} />
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </div>
              </div>

              {/* Right Sidebar */}
              <Sidebar />
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
