import { Button } from "@/shared/components/ui/button";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import type { Assessment } from "./types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface AssessmentSectionProps {
  assessments: Assessment[];
  onAssessmentsChange: (assessments: Assessment[]) => void;
  onAddClick: () => void;
  onDeleteAssessment: (id: number) => void;
}

function SortableAssessmentItem({
  assessment,
  onDelete,
}: {
  assessment: Assessment;
  onDelete: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: assessment.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50"
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex-1">
        <div className="font-medium text-sm">{assessment.title}</div>
        <div className="text-xs text-gray-600">{assessment.type}</div>
        {assessment.description && (
          <div className="text-xs text-gray-500 mt-1">
            {assessment.description}
          </div>
        )}
        {assessment.required && (
          <span className="text-xs text-blue-600 font-medium">Required</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600"
          onClick={() => onDelete(assessment.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function AssessmentSection({
  assessments,
  onAssessmentsChange,
  onAddClick,
  onDeleteAssessment,
}: AssessmentSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = assessments.findIndex((a) => a.id === active.id);
      const newIndex = assessments.findIndex((a) => a.id === over.id);
      onAssessmentsChange(arrayMove(assessments, oldIndex, newIndex));
    }
  };

  if (assessments.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center justify-center text-gray-400">
          <svg
            className="w-12 h-12 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm">
            No assessments have been added for this interview stage.
          </p>
          <Button
            type="button"
            className="mt-4 bg-blue-600 hover:bg-blue-700"
            onClick={onAddClick}
          >
            + Add Assessment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={assessments.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {assessments.map((assessment) => (
            <SortableAssessmentItem
              key={assessment.id}
              assessment={assessment}
              onDelete={onDeleteAssessment}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button
        type="button"
        variant="outline"
        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
        onClick={onAddClick}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add More
      </Button>
    </div>
  );
}
