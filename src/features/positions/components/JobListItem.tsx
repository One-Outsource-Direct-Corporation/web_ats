import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { getDepartmentColor } from "../utils/departmentColor";
import DOMPurify from "dompurify";
import formatName from "@/shared/utils/formatName";
import type { JobPostingDb } from "@/features/positions-client/types/create_position.types";
import { useContext } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext";

export default function JobListItem({ posting }: { posting: JobPostingDb }) {
  const { user } = useContext(AuthContext);
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
                className={`${getDepartmentColor(
                  formatName(
                    posting.department_name &&
                      posting.department_name === "other"
                      ? posting.department_name_other || ""
                      : posting.department_name || ""
                  )
                )} text-xs`}
              >
                {formatName(
                  posting.department_name === "other"
                    ? posting.department_name_other || ""
                    : posting.department_name || ""
                )}
              </Badge>

              <Badge
                variant="default"
                className={`text-xs ${
                  posting.type === "prf"
                    ? "bg-green-100 text-green-700"
                    : "bg-neutral-700 text-neutral-100"
                }`}
              >
                {posting.type === "prf" ? "Internal" : "Client"}
              </Badge>

              <Badge
                className={`text-xs ${
                  posting.status === "active"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : posting.status === "draft"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : posting.status === "closed"
                    ? "bg-red-100 text-red-800 border-red-200"
                    : "bg-gray-100 text-gray-800 border-gray-200"
                }`}
              >
                {formatName(posting.status)}
              </Badge>

              <Badge className="text-xs bg-cyan-500 text-white">
                {user && posting.posted_by_display.id === user.id
                  ? "You"
                  : posting.posted_by_display.full_name}
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
