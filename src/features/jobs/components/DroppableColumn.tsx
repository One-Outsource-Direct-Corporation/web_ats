import { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Maximize2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ApplicantCard } from "./ApplicantCard";
import type { StageColumnProps } from "../types/kanban.types";

interface DroppableColumnProps extends StageColumnProps {
  navigate: any;
  jobtitle?: string;
}

export function DroppableColumn({
  title,
  id,
  applicants,
  count,
  isSelectionMode,
  hasSelectedApplicants,
  onColumnClick,
  navigate,
  jobtitle,
}: DroppableColumnProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  useEffect(() => {
    const checkMobile = () => {
      const hasTouchScreen =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileUserAgent =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(
        hasTouchScreen && (isMobileUserAgent || window.innerWidth < 768)
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleColumnClick = () => {
    if (isMobile && isSelectionMode && hasSelectedApplicants) {
      onColumnClick(id);
    }
  };

  const handleMaximizeClick = () => {
    const stageRouteMapping: Record<string, string> = {
      "Resume Screening": "resumescreening",
      "Phone-Call Interview": "phonecallinterview",
      "Initial Interview": "initialinterview",
      Shortlisted: "shortlisted",
      Assessment: "assessments",
      "Final Interview": "finalinterview",
      "For Job Offer": "forjoboffer",
      "Job Offer & Finalization": "OfferAndFinalization",
      Onboarding: "Onboarding",
      Warm: "Warm",
      Failed: "Failed",
    };

    const routeSegment = stageRouteMapping[title];
    if (routeSegment) {
      const isCustomFinalStage = [
        "OfferAndFinalization",
        "Onboarding",
        "Warm",
        "Failed",
      ].includes(routeSegment);
      const currentJobTitle = jobtitle || "leaddeveloper";
      const jobSlug = currentJobTitle.toLowerCase().replace(/\s+/g, "");

      const path = isCustomFinalStage
        ? `/job/stage/${routeSegment}`
        : `/job/${jobSlug}/${routeSegment}`;

      navigate(path, {
        state: {
          jobTitle: jobtitle,
          stageName: title,
          from: location.pathname,
        },
      });
    }
  };

  return (
    <div className="w-full lg:w-[280px] lg:flex-shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
            {title}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={handleMaximizeClick}
        >
          <Maximize2 className="h-3 w-3" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        onClick={handleColumnClick}
        className={`
          border rounded-lg min-h-[300px] p-3 transition-colors duration-200
          ${isOver ? "bg-blue-50 border-blue-300" : "bg-gray-50"}
          ${
            isMobile && isSelectionMode && hasSelectedApplicants
              ? "cursor-pointer hover:bg-green-50 hover:border-green-300"
              : ""
          }
          ${
            isMobile && isSelectionMode && hasSelectedApplicants
              ? "ring-2 ring-green-200"
              : ""
          }
        `}
      >
        {isMobile && isSelectionMode && hasSelectedApplicants && (
          <div className="mb-3 p-2 bg-green-100 rounded-lg text-center">
            <p className="text-xs text-green-800 font-medium">
              Tap to move selected applicants here
            </p>
          </div>
        )}

        <SortableContext
          items={applicants.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applicants.map((applicant) => (
            <ApplicantCard key={applicant.id} {...applicant} />
          ))}
        </SortableContext>
        {applicants.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            {isMobile && isSelectionMode && hasSelectedApplicants
              ? "Tap to move here"
              : "Drop applicants here"}
          </div>
        )}
      </div>
    </div>
  );
}
