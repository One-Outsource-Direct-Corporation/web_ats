import { Button } from "@/shared/components/ui/button";
import { Edit, Trash2, GripVertical, FileText } from "lucide-react";
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
import type {
  Assessment,
  AssessmentInDb,
  AssessmentLocal,
} from "@/shared/types/pipeline.types";
import { AddAssessmentModal } from "./AddAssessmentModal";
import { useState, useEffect } from "react";

interface AssessmentSectionProps {
  assessments: Assessment[];
  onChange: (id: number | string, data: Assessment) => void;
  onAdd: (assessment: AssessmentLocal) => void;
  onDelete: (id: number | string) => void;
  onReorder?: (assessments: Assessment[]) => void;
}

function SortableAssessmentItem({
  assessment,
  onDelete,
  onEdit,
}: {
  assessment: Assessment;
  onDelete: (id: number | string) => void;
  onEdit: (assessment: Assessment) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id:
      (assessment as AssessmentInDb)?.id ||
      (assessment as AssessmentLocal).tempId,
  });

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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(assessment)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600"
          onClick={() =>
            onDelete(
              (assessment as AssessmentInDb)?.id ||
                (assessment as AssessmentLocal).tempId
            )
          }
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function AssessmentSection({
  assessments,
  onChange,
  onAdd,
  onDelete,
  onReorder,
}: AssessmentSectionProps) {
  const [openAssessment, setOpenAssessment] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(
    null
  );
  const [localAssessments, setLocalAssessments] =
    useState<Assessment[]>(assessments);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sync with parent assessments and sort by order field
  useEffect(() => {
    const sortedAssessments = [...assessments].sort(
      (a, b) => a.order - b.order
    );
    setLocalAssessments(sortedAssessments);
  }, [assessments]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const getId = (a: Assessment) =>
        (a as AssessmentInDb)?.id || (a as AssessmentLocal).tempId;
      const oldIndex = localAssessments.findIndex(
        (a) => getId(a) === active.id
      );
      const newIndex = localAssessments.findIndex((a) => getId(a) === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedAssessments = arrayMove(
          localAssessments,
          oldIndex,
          newIndex
        );

        // Update the order field for each assessment based on new position
        const assessmentsWithUpdatedOrder = reorderedAssessments.map(
          (assessment, index) => ({
            ...assessment,
            order: index + 1, // Start order from 1
          })
        );

        setLocalAssessments(assessmentsWithUpdatedOrder);

        // Update parent with new order
        if (onReorder) {
          onReorder(assessmentsWithUpdatedOrder);
        }
      }
    }
  };

  if (assessments.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center justify-center text-gray-400">
          <FileText className="w-12 h-12 mb-2" />
          <p className="text-sm">
            No assessments have been added for this interview stage.
          </p>
          <AddAssessmentModal
            open={openAssessment}
            onOpenChange={setOpenAssessment}
            onAdd={(assessment) => {
              // First assessment should have order 1
              const assessmentWithOrder = {
                ...assessment,
                order: 1,
              };
              onAdd(assessmentWithOrder);
            }}
          />
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
          items={localAssessments.map(
            (a) => (a as AssessmentInDb)?.id || (a as AssessmentLocal).tempId
          )}
          strategy={verticalListSortingStrategy}
        >
          {localAssessments.map((assessment) => (
            <SortableAssessmentItem
              key={
                (assessment as AssessmentInDb)?.id ||
                (assessment as AssessmentLocal).tempId
              }
              assessment={assessment}
              onDelete={onDelete}
              onEdit={(editedAssessment) =>
                setEditingAssessment(editedAssessment)
              }
            />
          ))}
        </SortableContext>
      </DndContext>

      <AddAssessmentModal
        open={openAssessment || editingAssessment !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpenAssessment(false);
            setEditingAssessment(null);
          } else {
            setOpenAssessment(true);
          }
        }}
        onAdd={(assessment) => {
          // Calculate next order value
          const maxOrder =
            localAssessments.length > 0
              ? Math.max(...localAssessments.map((a) => a.order))
              : 0;
          const assessmentWithOrder = {
            ...assessment,
            order: maxOrder + 1,
          };
          onAdd(assessmentWithOrder);
          setOpenAssessment(false);
        }}
        editingAssessment={editingAssessment}
        onUpdate={(id, updatedAssessment) => {
          onChange(id, updatedAssessment);
          setEditingAssessment(null);
          setOpenAssessment(false);
        }}
      />
    </div>
  );
}
