import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import type { JobPostingResponse } from "@/features/jobs/types/jobTypes";
import { getDepartmentColor } from "../utils/departmentColor";
import DOMPurify from "dompurify";
import formatName from "@/shared/utils/formatName";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { toast } from "react-toastify";

export default function JobListItem({
  posting,
  refetch,
}: {
  posting: JobPostingResponse;
  refetch: () => void;
}) {
  const axiosPrivate = useAxiosPrivate();
  console.log(posting);
  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition border rounded-md">
      <div className="flex justify-between items-start gap-4">
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
                    posting.department_name === "other"
                      ? posting.department_name_other
                      : posting.department_name
                  )
                )} text-xs`}
              >
                {formatName(
                  posting.department_name === "other"
                    ? posting.department_name_other
                    : posting.department_name
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
                {posting.type_display === "PRF" ? "Internal" : "Client"}
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
            </div>

            <div
              className="text-stone-400 text-sm line-clamp-1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(posting.description),
              }}
            />
          </div>
        </div>

        {/* Right section with publish select */}
        <div className="flex-shrink-0">
          <Select
            value={posting.published.toString()}
            onValueChange={async (value) => {
              // TODO: Implement publish/unpublish logic
              try {
                const endpoint =
                  posting.type === "prf"
                    ? `/api/prf/${posting.id}/`
                    : `/api/position/${posting.id}/`;
                const response = await axiosPrivate.patch(endpoint, {
                  job_posting: {
                    published: value === "true",
                    status: posting.status,
                  },
                });

                console.log(response);

                if (response.status === 200) {
                  refetch();
                  toast.success("Position updated successfully");
                }
              } catch (error) {
                console.log(error);
                toast.error("Failed to update position");
              }
            }}
          >
            <SelectTrigger
              className={`w-[120px] h-8 text-xs ${
                posting.published
                  ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                  : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true" className="text-xs">
                Published
              </SelectItem>
              <SelectItem value="false" className="text-xs">
                Unpublished
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
