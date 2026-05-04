import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosPrivate } from "@/config/axios";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  Search,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  CalendarDays,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  Upload,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface Application {
  id: number;
  job_posting: number;
  job_title?: string;
  status: string;
  email: string;
  source: string;
  submitted_at: string;
}

interface Task {
  id: number;
  job_title: string;
  job_req: string;
  task_title: string;
  task_status: "pending" | "done" | "in_progress";
  scheduled_date: string;
}

interface JobOffer {
  id: number;
  job_title: string;
  job_req: string;
  date: string;
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

const MOCK_TASKS: Task[] = [
  { id: 1, job_title: "Lead Developer", job_req: "R-80808", task_title: "Examination", task_status: "done", scheduled_date: "2025-02-16" },
  { id: 2, job_title: "Quality Assurance", job_req: "R-10101", task_title: "Online Interview", task_status: "pending", scheduled_date: "2025-02-16" },
  { id: 3, job_title: "Business Analyst", job_req: "R-20202", task_title: "Upload Documents", task_status: "pending", scheduled_date: "2025-02-16" },
];

const MOCK_OFFERS: JobOffer[] = [
  { id: 1, job_title: "Lead Developer", job_req: "R-80808", date: "2025-02-16", documents_count: 0 },
  { id: 2, job_title: "Quality Assurance", job_req: "R-10101", date: "2025-02-16", documents_count: 0 },
  { id: 3, job_title: "Business Analyst", job_req: "R-20202", date: "2025-02-16", documents_count: 0 },
];

const MOCK_EVENTS: CalendarEvent[] = [
  { id: 1, date: "2025-02-03", time: "01:00 - 02:00 PM", title: "Interview", location: "3/F CLF1 Building, 1167 Chino Roces Ave, Makati, Metro Manila", type: "interview" },
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
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState("");
  const [activeTab, setActiveTab] = useState<"progress" | "documents">("progress");

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const monthName = new Date(calYear, calMonth).toLocaleString("default", { month: "long", year: "numeric" });

  useEffect(() => {
    axiosPrivate
      .get("/api/candidate/me/applications/")
      .then((res) => {
        const data = res.data.results || res.data || [];
        setApplications(data);
      })
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredApplications = applications.filter((app) =>
    searchCode
      ? app.job_title?.toLowerCase().includes(searchCode.toLowerCase())
      : true
  );

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/OODC%20logo3.png"
              alt="One Outsource"
              className="h-10 cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Job Openings
            </Link>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    Candidate
                  </span>
                  {user?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {user.email}
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
                  {loading ? (
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
                      {MOCK_TASKS.map((task) => (
                        <tr key={task.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{task.job_title}</div>
                            <div className="text-xs text-gray-500">{task.job_req}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{task.task_title}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={task.task_status} />
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {new Date(task.scheduled_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
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
                      {MOCK_OFFERS.map((offer) => (
                        <tr key={offer.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{offer.job_title}</div>
                            <div className="text-xs text-gray-500">{offer.job_req}</div>
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
                            {new Date(offer.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <Button size="sm" variant="outline" className="text-xs h-8">
                              <Upload className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </td>
                        </tr>
                      ))}
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
              {MOCK_EVENTS.map((event) => (
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
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                    <div className="flex items-start gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state for more events */}
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                <CalendarDays className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-400">No more upcoming events</p>
              </div>
            </div>
          </div>
        </div>
      </main>

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
