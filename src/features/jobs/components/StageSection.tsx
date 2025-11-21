import { DroppableColumn } from "./DroppableColumn";
import type { StageSectionProps } from "../types/kanban.types";

export function StageSection({
  title,
  columns,
  applicantColumns,
  isMultiRow = false,
  selectedApplicants,
  isSelectionMode,
  onLongPress,
  onToggleSelect,
  onColumnClick,
  navigate,
  jobtitle,
}: StageSectionProps) {
  if (isMultiRow && columns.length === 5) {
    // Special layout for Stage 3 with 5 columns
    const firstRow = columns.slice(0, 3);
    const secondRow = [
      { title: "Warm", id: "warm" },
      { title: "Failed", id: "failed" },
    ];

    return (
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <div className="h-1 w-16 bg-blue-500 rounded"></div>
        </div>

        {/* First row - 3 columns */}
        <div className="flex flex-col lg:flex-row gap-6 lg:overflow-x-auto pb-4 mb-6">
          {firstRow.map((column) => (
            <DroppableColumn
              key={column.id}
              title={column.title}
              id={column.id}
              applicants={
                applicantColumns[column.id]?.map((applicant) => ({
                  ...applicant,
                  isSelected: selectedApplicants.has(applicant.id),
                  isSelectionMode,
                  onLongPress,
                  onToggleSelect,
                })) || []
              }
              count={(applicantColumns[column.id] || []).length}
              isSelectionMode={isSelectionMode}
              hasSelectedApplicants={selectedApplicants.size > 0}
              onColumnClick={onColumnClick}
              navigate={navigate}
              jobtitle={jobtitle}
            />
          ))}
        </div>

        {/* Second row - 2 columns */}
        <div className="flex flex-col lg:flex-row gap-6 lg:overflow-x-auto pb-4">
          {secondRow.map((column) => (
            <DroppableColumn
              key={column.id}
              title={column.title}
              id={column.id}
              applicants={
                applicantColumns[column.id]?.map((applicant) => ({
                  ...applicant,
                  isSelected: selectedApplicants.has(applicant.id),
                  isSelectionMode,
                  onLongPress,
                  onToggleSelect,
                })) || []
              }
              count={(applicantColumns[column.id] || []).length}
              isSelectionMode={isSelectionMode}
              hasSelectedApplicants={selectedApplicants.size > 0}
              onColumnClick={onColumnClick}
              navigate={navigate}
              jobtitle={jobtitle}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="h-1 w-16 bg-blue-500 rounded"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:overflow-x-auto pb-4">
        {columns.map((column) => (
          <DroppableColumn
            key={column.id}
            title={column.title}
            id={column.id}
            applicants={
              applicantColumns[column.id]?.map((applicant) => ({
                ...applicant,
                isSelected: selectedApplicants.has(applicant.id),
                isSelectionMode,
                onLongPress,
                onToggleSelect,
              })) || []
            }
            count={(applicantColumns[column.id] || []).length}
            isSelectionMode={isSelectionMode}
            hasSelectedApplicants={selectedApplicants.size > 0}
            onColumnClick={onColumnClick}
            navigate={navigate}
            jobtitle={jobtitle}
          />
        ))}
      </div>
    </div>
  );
}
