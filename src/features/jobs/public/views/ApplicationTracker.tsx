import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { appNavigation } from "@/shared/utils/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Calendar } from "@/shared/components/ui/calendar";
import { CareersFooter } from "../components/CareersFooter";
import { useApplicationTracker } from "../hooks/useApplicationTracker";

const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const toDisplayDate = (value: string | null) => {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return dateFormatter.format(parsed);
};

const getStatusClassName = (status: string) => {
  const normalized = status.toLowerCase();

  if (["hired", "passed", "done"].includes(normalized)) {
    return "bg-green-100 text-green-700";
  }

  if (["offered", "scheduled", "in_review", "in_progress"].includes(normalized)) {
    return "bg-blue-100 text-blue-700";
  }

  if (["rejected", "failed", "cancelled", "withdrawn"].includes(normalized)) {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-700";
};

export default function ApplicationTracker() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [trackingCode, setTrackingCode] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { data, error, isLoading, trackApplication, clearResult } =
    useApplicationTracker();

  useEffect(() => {
    document.title = "Track Application";
  }, []);

  useEffect(() => {
    const searchQuery = appNavigation.getSearchQuery();
    if (!searchQuery) {
      return;
    }

    setTrackingCode(searchQuery);
    appNavigation.clearSearchQuery();
  }, []);

  const handleSearch = async () => {
    setHasSearched(true);
    await trackApplication(trackingCode);
  };

  const handleClear = () => {
    setHasSearched(false);
    setTrackingCode("");
    clearResult();
  };

  const eventItems = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.pipeline_steps
      .filter((step) => step.reminder)
      .map((step) => ({
        title: step.process_title,
        statusLabel: step.status_label,
        reminder: step.reminder,
      }));
  }, [data]);

  const latestStatusDate = useMemo(() => {
    if (!data || data.status_history.length === 0) {
      return null;
    }

    return data.status_history[data.status_history.length - 1]?.created_at ?? null;
  }, [data]);

  const isShowingResult = hasSearched && data;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full mt-0 p-4 flex items-center justify-between bg-white shadow-md rounded-b-2xl">
        <div className="flex items-center gap-4 ml-6">
          <div className="text-2xl font-bold text-blue-600">
            <img src="/OODC%20logo2.png" alt="OODC Logo" className="h-24 mx-auto" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="w-full lg:w-[70%] p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                onClick={handleSearch}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                disabled={isLoading}
              >
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? "Searching..." : "Search"}
              </Button>

              <div className="w-full sm:flex-1">
                <Input
                  placeholder="Enter your tracking code"
                  value={trackingCode}
                  onChange={(event) => setTrackingCode(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void handleSearch();
                    }
                  }}
                />
              </div>

              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full sm:w-auto text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent px-6 py-2"
              >
                Job Openings
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                className="w-full sm:w-auto"
              >
                Clear
              </Button>
            </div>
          </div>

          {error && hasSearched ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-red-200">
              <h3 className="text-lg font-medium text-red-600 mb-2">
                Unable to Track Application
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : null}

          {isShowingResult ? (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-blue-600">Progress</h2>
                  <div className="flex-1 h-px bg-blue-600" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="px-4 py-3 text-left">Applicant</th>
                        <th className="px-4 py-3 text-left">Job Title</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-300">
                        <td className="px-4 py-3 text-gray-900">{data.applicant_name}</td>
                        <td className="px-4 py-3 text-gray-900">{data.job_title || "-"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClassName(data.status)}`}
                          >
                            {data.status_label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {toDisplayDate(data.submitted_at)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-blue-600">Application Timeline</h2>
                  <div className="flex-1 h-px bg-blue-600" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="px-4 py-3 text-left">Previous</th>
                        <th className="px-4 py-3 text-left">Current</th>
                        <th className="px-4 py-3 text-left">Remarks</th>
                        <th className="px-4 py-3 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.status_history.map((historyItem, index) => (
                        <tr key={`${historyItem.created_at}-${index}`} className="border-t border-gray-300">
                          <td className="px-4 py-3 text-gray-900">
                            {historyItem.previous_status_label || "Initial"}
                          </td>
                          <td className="px-4 py-3 text-gray-900">{historyItem.new_status_label}</td>
                          <td className="px-4 py-3 text-gray-900">{historyItem.remarks || "-"}</td>
                          <td className="px-4 py-3 text-gray-900">
                            {toDisplayDate(historyItem.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-blue-600">My Tasks</h2>
                  <div className="flex-1 h-px bg-blue-600" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="px-4 py-3 text-left">Task</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Schedule</th>
                        <th className="px-4 py-3 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.pipeline_steps.length === 0 ? (
                        <tr className="border-t border-gray-300">
                          <td className="px-4 py-3 text-gray-500" colSpan={4}>
                            No tasks available yet.
                          </td>
                        </tr>
                      ) : (
                        data.pipeline_steps.map((stepItem, index) => (
                          <tr
                            key={`${stepItem.process_type}-${stepItem.order}-${index}`}
                            className="border-t border-gray-300"
                          >
                            <td className="px-4 py-3 text-gray-900">{stepItem.process_title}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClassName(stepItem.status)}`}
                              >
                                {stepItem.status_label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-900">
                              {toDisplayDate(stepItem.reminder)}
                            </td>
                            <td className="px-4 py-3 text-gray-900">{stepItem.notes || "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-blue-600">Job Offer</h2>
                  <div className="flex-1 h-px bg-blue-600" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="px-4 py-3 text-left">Job Title</th>
                        <th className="px-4 py-3 text-left">Current Status</th>
                        <th className="px-4 py-3 text-left">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.status === "offered" || data.status === "hired" ? (
                        <tr className="border-t border-gray-300">
                          <td className="px-4 py-3 text-gray-900">{data.job_title || "-"}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClassName(data.status)}`}
                            >
                              {data.status_label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-900">
                            {toDisplayDate(latestStatusDate)}
                          </td>
                        </tr>
                      ) : (
                        <tr className="border-t border-gray-300">
                          <td className="px-4 py-3 text-gray-500" colSpan={3}>
                            No job offer available yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}

          {!hasSearched ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Enter Your Tracking Code
              </h3>
              <p className="text-gray-600">
                Please enter your tracking code in the search field above to
                view your application status and tasks.
              </p>
            </div>
          ) : null}
        </div>

        <div className="w-full lg:w-[30%] p-6 pt-0 lg:pt-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold text-blue-600">Events</h2>
              <div className="flex-1 h-px bg-blue-600" />
            </div>

            <div className="space-y-4">
              {eventItems.length === 0 ? (
                <p className="text-sm text-gray-500">No events scheduled yet.</p>
              ) : (
                eventItems.map((eventItem, index) => (
                  <div
                    key={`${eventItem.title}-${index}`}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{eventItem.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {toDisplayDate(eventItem.reminder)}
                    </p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusClassName(eventItem.statusLabel)}`}
                    >
                      {eventItem.statusLabel}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CareersFooter />
    </div>
  );
}
