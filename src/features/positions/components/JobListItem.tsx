import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import type { PositionData } from "../types/positionTypes";
import { getDepartmentColor } from "../utils/departmentColor";
import type { PRFData } from "@/features/prf/types/prfTypes";
import DOMPurify from "dompurify";
import formatName from "@/shared/utils/formatName";

interface JobListItemProps {
  posting: PositionData | PRFData;
}

export default function JobListItem({ posting }: JobListItemProps) {
  // const handleCheckboxChange = () => {
  //   onSelectionChange(toggleItemSelection(selected, index));
  // };

  // const handleEdit = () => {
  //   if (onEdit) {
  //     onEdit(posting);
  //   } else {
  //     navigate("/positions/create-new-position");
  //   }
  // };

  // const renderActionButton = () => {
  //   if (selected.length > 0) return null;

  //   switch (currentTab) {
  //     case "drafts":
  //     case "closed":
  //       return (
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           className="text-blue-600 hover:underline text-sm flex items-center gap-1"
  //           onClick={handleEdit}
  //         >
  //           <Pencil className="w-4 h-4" />
  //           Edit
  //         </Button>
  //       );
  //     case "published":
  //       return (
  //         <div className="flex items-center gap-2 cursor-pointer">
  //           <ExternalLink className="w-4 h-4 text-gray-500 hover:text-blue-600" />
  //         </div>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition border rounded-md">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-4 sm:gap-6">
          <div className="pt-1">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
              // checked={isItemSelected(selected, index)}
              // onChange={handleCheckboxChange}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-gray-800">
                {posting.job_title}
              </h3>
              {posting.type === "position" && (
                <Badge
                  variant="secondary"
                  // className={`${getDepartmentColor(posting.)} text-xs`}
                >
                  {(posting as PositionData).client}
                </Badge>
              )}

              <Badge
                className={`${getDepartmentColor(
                  formatName(posting.department)
                )} text-xs`}
              >
                {formatName(posting.department)}
              </Badge>
              <Badge variant="default" className="text-xs">
                {posting.type_display}
              </Badge>
              {
                // To do: restore badge for deleted positions
                /* {currentTab === "deleted" && (
                <Badge variant="destructive" className="text-xs">
                  Deleted
                </Badge>
              )} */
              }
            </div>

            <div
              className="text-stone-400 text-sm line-clamp-1 w-[80%]"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(posting.description),
              }}
            />
          </div>
        </div>
        {/* {renderActionButton()} */}
      </div>
    </Card>
  );
}
