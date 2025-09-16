import type { Applicant } from "../types/Applicant";
import { Badge } from "@/components/ui/badge.tsx";
import { Link } from "react-router-dom";

interface Props {
  applicants: Applicant[];
}

export const ApplicantList = ({ applicants }: Props) => {
  return (
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2 text-center">Status</th>
          <th className="px-4 py-2 text-center">Position</th>
          <th className="px-4 py-2 text-center">Department</th>
          <th className="px-4 py-2 text-center">Employment Type</th>
        </tr>
      </thead>
      <tbody>
        {applicants.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-6 text-gray-400">
              No applicants found.
            </td>
          </tr>
        ) : (
          applicants.map((a) => (
            <tr key={a.id} className="border-t text-sm text-gray-800">
              <td className="px-4 py-3">
                <Link
                  to={`/job/list/applicants/${encodeURIComponent(
                    a.name.replace(/\s+/g, "-").toLowerCase()
                  )}`}
                  className="flex items-center gap-3 hover:underline hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <img
                    src={a.avatar || "/placeholder.svg"}
                    alt={a.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{a.name}</span>
                </Link>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                  {a.status || "N/A"}
                </span>
              </td>
              <td className="px-4 py-3 text-center">{a.position || "-"}</td>
              <td className="px-4 py-3 text-center">{a.department || "-"}</td>
              <td className="px-4 py-3 text-center">
                <Badge
                  className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5"
                  variant="outline"
                >
                  {a.type || "-"}
                </Badge>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
