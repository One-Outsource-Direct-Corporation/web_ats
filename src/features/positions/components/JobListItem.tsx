import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { getDepartmentColor } from "../utils/departmentColor";
import DOMPurify from "dompurify";
import formatName from "@/shared/utils/formatName";
import { useContext } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { formatDepartmentName } from "@/shared/utils/formatDepartmentName";
import type { JobPostingResponseMinimal } from "@/features/jobs/types/JobPosting";

export default function JobListItem({
  posting,
}: {
  posting: JobPostingResponseMinimal;
}) {
  const { user } = useContext(AuthContext);

  const statusValue = posting.status;
  const typeValue = posting.type;
  const departmentDisplay = formatDepartmentName(
    posting.department?.name ?? "",
  );
  const postedBy = posting.posted_by;
  const isOwnedByCurrentUser =
    !!user &&
    !!postedBy &&
    typeof postedBy.id === "number" &&
    postedBy.id === user.id;
  const posterLabel = isOwnedByCurrentUser
    ? "You"
    : [postedBy?.first_name, postedBy?.last_name].filter(Boolean).join(" ") ||
      "Unknown";

  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition border rounded-md">
      <div>
        {/* Left section with checkbox and content */}
        <div className="flex items-start gap-4 sm:gap-6 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="text-base font-semibold text-gray-800">
                {posting.job_title}
              </h3>

              <Badge
                className={`${getDepartmentColor(departmentDisplay)} text-xs`}
              >
                {departmentDisplay || "Unknown Department"}
              </Badge>

              {typeValue && (
                <Badge
                  variant="default"
                  className={`text-xs ${
                    typeValue === "prf"
                      ? "bg-green-100 text-green-700"
                      : "bg-neutral-700 text-neutral-100"
                  }`}
                >
                  {typeValue === "prf" ? "Internal" : "Client"}
                </Badge>
              )}

              {statusValue && (
                <Badge
                  className={`text-xs ${
                    statusValue === "active"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : statusValue === "draft"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : statusValue === "closed"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  {formatName(statusValue) || "Unknown"}
                </Badge>
              )}

              <Badge className="text-xs bg-cyan-500 text-white">
                {posterLabel}
              </Badge>
            </div>

            <div
              className="text-stone-400 text-sm line-clamp-1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(posting.description || ""),
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
