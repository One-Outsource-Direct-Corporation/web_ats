import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { queryKeys } from "@/shared/query-keys";
import {
  Search,
  Briefcase,
  MapPin,
  Mail,
  CalendarDays,
  Clock,
  FileText,
  Upload,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface Application {
  id: number;
  job_title: string;
  status: string;
  submitted_at: string;
}

interface Task {
  id: number;
  job_title: string;
  assessment_type_label: string;
  task_status: "pending" | "done" | "submitted" | "graded";
  scheduled_date: string;
  score?: number | null;
  candidate_application_id: number;
}

interface JobOffer {
  id: number;
  job_title: string;
  reference_id: string;
  date_sent: string;
  status: string;
  documents_count: number;
}

interface DocumentItem {
  id: string;
  name: string;
  required: boolean;
  status: "pending" | "submitted" | "verified";
}

interface CalendarEvent {
  id: number;
  date: string;
  time: string;
  title: string;
  location: string;
  type: "interview" | "exam" | "orientation";
}

interface DashboardData {
  first_name: string;
  last_name: string;
  email: string;
  photo_url: string | null;
  applications: Application[];
  events: CalendarEvent[];
  tasks: Task[];
  offers: JobOffer[];
}

const STATUS_COLORS: Record<string, string> = {
  received: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "on_hold": "bg-amber-50 text-amber-700 border-amber-200",
  hired: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-gray-50 text-gray-700 border-gray-200",
  shortlist: "bg-purple-50 text-purple-700 border-purple-200",
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  in_progress: "bg-sky-50 text-sky-700 border-sky-200",
};

const DOCUMENTS: DocumentItem[] = [
  { id: "nbi", name: "Valid NBI Clearance or Police Clearance", required: true, status: "pending" },
  { id: "medical", name: "Medical Certificate", required: true, status: "pending" },
  { id: "coe", name: "Certificate of Employment (COE) and Income", required: true, status: "pending" },
  { id: "itr", name: "Tax Return (ITR 2316)", required: true, status: "pending" },
  { id: "brgy", name: "Barangay Clearance", required: true, status: "pending" },
  { id: "birth", name: "Photocopy of Birth Certificate", required: true, status: "pending" },
  { id: "dependent", name: "Photocopy of Dependents Birth Certificate (if applicable)", required: false, status: "pending" },
  { id: "marriage", name: "Photocopy of Marriage Contract (if applicable)", required: false, status: "pending" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase().replace(/\s+/g, "_");
  const className =
    STATUS_COLORS[normalized] ||
    "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${className}`}>
      {status.replace(/_/g, " ").toUpperCase()}
    </span>
  );
}

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchCode, setSearchCode] = useState("");
  const [activeTab, setActiveTab] = useState<"progress" | "documents">("progress");
  const [taskFilter, setTaskFilter] = useState<"pending" | "submitted" | "graded">("pending");

  const axiosPrivate = useAxiosPrivate();

  const { isLoading, isError, data: dashboard } = useQuery({
    queryKey: queryKeys.candidates.applications(),
    queryFn: async () => {
      const res = await axiosPrivate.get("/api/candidate/me/");
      const data = res.data as Record<string, unknown>;
      // Map backend events to CalendarEvent shape
      const mappedEvents: CalendarEvent[] = (
        (data.events as Array<Record<string, unknown>>) || []
      ).map((event) => {
        const dt = new Date(event.scheduled_for as string);
        return {
          id: event.id as number,
          date: dt.toISOString().split("T")[0],
          time: dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          title: `${event.process_type_label} - ${event.job_title}`,
          location: "",
          type: event.event_type as CalendarEvent["type"],
        };
      });

      // Map backend tasks
      const mappedTasks: Task[] = (
        (data.tasks as Array<Record<string, unknown>>) || []
      ).map((task) => ({
        id: task.id as number,
        job_title: task.job_title as string || '',
        assessment_type_label: task.assessment_type_label as string || 'Assessment',
        task_status: (task.task_status as Task['task_status']) || 'pending',
        scheduled_date: task.scheduled_date as string || '',
        score: task.score as number | null | undefined,
        candidate_application_id: task.candidate_application_id as number,
      }));

      // Map backend offers
      const mappedOffers: JobOffer[] = (
        (data.offers as Array<Record<string, unknown>>) || []
      ).map((offer) => ({
        id: offer.id as number,
        job_title: offer.job_title as string || '',
        reference_id: offer.reference_id as string || '',
        date_sent: offer.date_sent as string || '',
        status: offer.status as string || '',
        documents_count: (offer.documents_count as number) || 0,
      }));

      const dashboardData: DashboardData = {
        first_name: data.first_name as string || '',
        last_name: data.last_name as string || '',
        email: data.email as string || '',
        photo_url: data.photo_url as string | null || null,
        applications: (data.applications as Application[]) || [],
        events: mappedEvents,
        tasks: mappedTasks,
        offers: mappedOffers,
      };
      return dashboardData;
    },
  });

  const profilePhotoUrl = dashboard?.photo_url;
  const applications = dashboard?.applications ?? [];
  const events = dashboard?.events ?? [];
  const tasks = dashboard?.tasks ?? [];
  const offers = dashboard?.offers ?? [];

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const monthName = new Date(calYear, calMonth).toLocaleString("default", { month: "long", year: "numeric" });

  const filteredApplications = applications.filter((app) =>
    searchCode
      ? app.job_title?.toLowerCase().includes(searchCode.toLowerCase())
      : true
  );

  const filteredTasks = tasks.filter((t) => t.task_status === taskFilter);

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search + Actions */}
          <div className="flex items-center gap-3">
            <Button
              className="bg-[#0056d2] hover:bg-blue-700 text-white"
              onClick={() => setSearchCode("")}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Code"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              variant="outline"
              className="ml-auto text-blue-600 border-blue-600 hover:bg-blue-50"
              onClick={() => navigate("/")}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Job Opening
            </Button>
          </div>

          {/* Information / Profile Card */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-bold text-[#0056d2]">Information</h2>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6 flex items-center gap-6">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="h-8 w-8" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {dashboard?.first_name} {dashboard?.last_name}
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    Candidate
                  </span>
                  {dashboard?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {dashboard.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Tab Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("progress")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "progress"
                  ? "bg-[#0056d2] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}
            >
              Progress & Tasks
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "documents"
                  ? "bg-[#0056d2] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}
            >
              Documents
            </button>
          </div>

          {activeTab === "progress" ? (
            <>
              {/* Progress Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-bold text-[#0056d2]">Progress</h2>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading applications...</div>
                  ) : filteredApplications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No applications yet.</p>
                      <Button
                        variant="link"
                        className="text-blue-600 mt-2"
                        onClick={() => navigate("/")}
                      >
                        Browse job openings
                      </Button>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#0056d2] text-white">
                        <th className="px-4 py-3 text-left font-semibold">Job Title</th>
                        <th className="px-4 py-3 text-left font-semibold">Application Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Date</th>
                        <th className="px-4 py-3 text-left font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.map((app) => (
                          <tr key={app.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">
                              <Link
                                to={`/candidate/applications/${app.id}`}
                                className="hover:text-blue-600 hover:underline"
                              >
                                {app.job_title || `Application #${app.id}`}
                              </Link>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={app.status} />
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {app.submitted_at
                                ? new Date(app.submitted_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-7 px-2"
                                onClick={() => navigate(`/candidate/applications/${app.id}`)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>

              {/* My Tasks Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-bold text-[#0056d2]">My Tasks</h2>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
                <div className="flex gap-2 mb-3">
                  {(["pending", "submitted", "graded"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTaskFilter(filter)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        taskFilter === filter
                          ? "bg-[#0056d2] text-white"
                          : "bg-white text-gray-600 border hover:bg-gray-100"
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0056d2] text-white">
                        <th className="px-4 py-3 text-left font-semibold">Job Title</th>
                        <th className="px-4 py-3 text-left font-semibold">Task Title</th>
                        <th className="px-4 py-3 text-left font-semibold">Task Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Scheduled Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                            No {taskFilter} tasks.
                          </td>
                        </tr>
                      ) : (
                        filteredTasks.map((task) => (
                          <tr key={task.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">{task.job_title}</div>
                            </td>
                            <td className="px-4 py-3 text-gray-700">{task.assessment_type_label}</td>
                            <td className="px-4 py-3">
                              <StatusBadge status={task.task_status} />
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {task.scheduled_date
                                ? new Date(task.scheduled_date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "—"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Job Offer Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-bold text-[#0056d2]">Job Offer</h2>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0056d2] text-white">
                        <th className="px-4 py-3 text-left font-semibold">Job Title</th>
                        <th className="px-4 py-3 text-left font-semibold">Task Action</th>
                        <th className="px-4 py-3 text-left font-semibold">Date</th>
                        <th className="px-4 py-3 text-left font-semibold">Documents</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            No job offers yet.
                          </td>
                        </tr>
                      ) : (
                        offers.map((offer) => (
                        <tr key={offer.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{offer.job_title}</div>
                            <div className="text-xs text-gray-500">{offer.reference_id}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                                Accept
                              </button>
                              <button className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors">
                                Reject
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {offer.date_sent
                              ? new Date(offer.date_sent).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">{offer.documents_count}</span>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : (
            /* Documents Section */
            <section>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-bold text-[#0056d2]">Documents</h2>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Submitted
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Pending
                    </span>
                  </div>
                  <Button className="bg-[#0056d2] hover:bg-blue-700 text-white">
                    Submit
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Document List */}
                  <div className="space-y-2">
                    {DOCUMENTS.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 leading-snug">{doc.name}</p>
                        </div>
                        {doc.required && (
                          <span className="text-red-500 text-xs">*</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">It&apos;s empty here</h3>
                    <p className="text-sm text-gray-500 mb-4 max-w-xs">
                      Upload your documents to complete your application requirements
                    </p>
                    <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Add File
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Calendar */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{monthName}</h3>
              <div className="flex gap-1">
                <button
                  onClick={prevMonth}
                  className="p-1 rounded hover:bg-gray-100 text-gray-600"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1 rounded hover:bg-gray-100 text-gray-600"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="py-1 font-semibold text-blue-600">
                  {d}
                </div>
              ))}
              {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isToday =
                  day === today.getDate() &&
                  calMonth === today.getMonth() &&
                  calYear === today.getFullYear();
                return (
                  <div
                    key={day}
                    className={`py-1.5 rounded-full text-xs cursor-pointer hover:bg-blue-50 ${
                      isToday ? "bg-[#0056d2] text-white hover:bg-blue-700" : "text-gray-700"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Events */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-bold text-[#0056d2]">Events</h2>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <CalendarDays className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-400">No upcoming events</p>
                </div>
              ) : (
                events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-sm border p-4 flex gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-lg flex flex-col items-center justify-center border border-blue-100">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      {new Date(event.date).toLocaleString("default", { month: "short" })}
                    </span>
                    <span className="text-xl font-bold text-gray-900 leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-blue-600 font-medium">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{event.title}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                    {event.location && (
                      <div className="flex items-start gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0056d2] text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-6 mb-3">
            <span className="text-sm opacity-80 hover:opacity-100 cursor-pointer">f</span>
            <span className="text-sm opacity-80 hover:opacity-100 cursor-pointer">in</span>
            <span className="text-sm opacity-80 hover:opacity-100 cursor-pointer">@</span>
          </div>
          <p className="text-sm opacity-80">
            © 2025 One Outsource Direct Group •{" "}
            <a href="#" className="hover:underline">Privacy</a> •{" "}
            <a href="#" className="hover:underline">Terms</a> •{" "}
            <a href="#" className="hover:underline">Sitemap</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
