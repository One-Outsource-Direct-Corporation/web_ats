import type { PRFData } from "@/features/prf/types/prfTypes";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";
import { usePositions } from "@/shared/hooks/usePositions";
import formatDate from "@/shared/utils/formatDate";
import formatName, { formatNameBySpace } from "@/shared/utils/formatName";

function getStatusColor(status: string) {
  switch (status) {
    case "draft":
      return "bg-green-100 text-green-800";
    case "closed":
      return "bg-red-100 text-red-800";
    case "cancelled":
      return "bg-gray-100 text-gray-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
}

export default function Request() {
  const { positions, loading, error } = usePositions("no_active");
  console.log(positions);

  return (
    <main className="flex flex-col bg-gray-50 min-h-screen">
      {/* Fixed top filter/search section */}
      <div className="left-0 right-0 z-20 bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
        <div className="max-w-7xl mx-auto space-y-3">
          <h1 className="text-3xl font-bold text-gray-800">Request</h1>
          <p className="text-lg text-gray-700">
            Handles hiring requests and approvals.
          </p>
          {/* <FilterBar /> */}
        </div>
      </div>

      {/* Main content section */}
      {loading && <LoadingComponent />}
      {!loading && (
        <div className="flex-grow px-6 mt-5 pb-[80px] max-w-7xl mx-auto w-full">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-50 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-3 w-12"></th>
                <th className="px-4 py-3">Position Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Immediate Supervisor</th>
                <th className="px-4 py-3">Date Requested</th>
                <th className="px-4 py-3">Approving Officer</th>
                <th className="px-4 py-3 text-center w-16">Pipeline</th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr className="border-t">
                  <td
                    colSpan={7}
                    className="text-center text-red-500 px-4 py-3"
                  >
                    Something went wrong. Please try again later.
                  </td>
                </tr>
              )}
              {!loading && !error && positions.length === 0 && (
                <tr className="border-t">
                  <td
                    colSpan={7}
                    className="text-center text-gray-500 px-4 py-3"
                  >
                    This tab is empty.
                  </td>
                </tr>
              )}
              {!loading && !error && positions.length > 0 && (
                <>
                  {positions.map((item) => (
                    <tr
                      key={item.unique_id}
                      className="border-t odd:bg-transparent even:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {item.job_title}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 whitespace-nowrap rounded-full font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {formatName(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {(item as PRFData)?.immediate_supervisor ? (
                          <>
                            <div className="font-medium">
                              {formatNameBySpace(
                                (item as PRFData).immediate_supervisor
                              )}
                            </div>
                            <div className="text-gray-500">
                              {formatName(item.department)}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-4 py-3">No Approver</td>
                      <td className="px-4 py-3 text-center">
                        {item.status === "pending" ? (
                          <span className="text-gray-400">—</span>
                        ) : (
                          // Bring back when approval pipeline is available
                          // <ApprovalPipelineDropdown
                          //   pipeline={item.approvalPipeline}
                          // />
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
