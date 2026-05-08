import { useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  ClipboardList,
  X,
  Download,
  Trash2,
  Loader2,
  CheckCircle2,
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
  is_preonboarding?: boolean;
}

interface PreonboardingProgress {
  total: number;
  required_count: number;
  required_submitted: number;
  required_pending: number;
  submitted: number;
  verified: number;
  pending: number;
  stale: number;
}

interface PreonboardingDashboardData {
  candidate_application_id: number | null;
  requirements: { status: string; required: boolean }[];
  progress: PreonboardingProgress;
}

interface JobOffer {
  id: number;
  job_title: string;
  reference_id: string;
  date_sent: string;
  status: string;
  offer_document_url: string | null;
  signed_document_url: string | null;
}

interface CalendarEvent {
  id: number;
  date: string;
  time: string;
  title: string;
  location: string;
  type: "interview" | "exam" | "orientation";
}

interface CandidateDocument {
  id: number;
  original_filename: string;
  filename: string;
  file_url: string;
  created_at: string;
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

interface RequiredDocument {
  label: string;
  keywords: string[];
}

const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  { label: "NBI Clearance", keywords: ["nbi", "clearance"] },
  { label: "Police Clearance", keywords: ["police", "clearance"] },
  { label: "Certificate of Employment (COE)", keywords: ["coe", "certificate of employment", "employment certificate"] },
  { label: "Income Tax Return (ITR 2316)", keywords: ["itr", "tax return", "2316", "bir"] },
  { label: "Barangay Clearance", keywords: ["barangay", "clearance"] },
  { label: "Photocopy of Dependents Birth Certificate", keywords: ["dependent", "birth certificate", "birth cert"] },
  { label: "Photocopy of Marriage Contract", keywords: ["marriage", "contract", "marriage contract"] },
  { label: "Photocopy of Birth Certificate", keywords: ["birth certificate", "birth cert", "psa"] },
];

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
        is_preonboarding: false,
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
        offer_document_url: offer.offer_document_url as string | null || null,
        signed_document_url: offer.signed_document_url as string | null || null,
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

  const { data: preonboardingDashboardData } = useQuery({
    queryKey: queryKeys.preonboarding.data(),
    queryFn: async () => {
      const res = await axiosPrivate.get("/api/candidate/me/preonboarding/");
      return res.data as PreonboardingDashboardData;
    },
  });

  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<CandidateDocument | null>(null);
  const [pendingUploadDoc, setPendingUploadDoc] = useState<string | null>(null);
  const [selectedDocReq, setSelectedDocReq] = useState<RequiredDocument | null>(null);

  const { data: documents = [], isLoading: docsLoading } = useQuery({
    queryKey: queryKeys.documents.list(),
    queryFn: async () => {
      const res = await axiosPrivate.get("/api/candidate/me/documents/");
      return res.data as CandidateDocument[];
    },
  });

  const deleteDocMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosPrivate.delete(`/api/candidate/me/documents/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
    },
  });

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axiosPrivate.post("/api/candidate/me/documents/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
    } catch {
      // handled by interceptor
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const profilePhotoUrl = dashboard?.photo_url;
  const applications = dashboard?.applications ?? [];
  const events = dashboard?.events ?? [];
  const tasks = dashboard?.tasks ?? [];
  const offers = dashboard?.offers ?? [];

  // Job offer action state
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [uploadedFileIds, setUploadedFileIds] = useState<Record<number, number>>({});
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineOfferId, setDeclineOfferId] = useState<number | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  function handleDownload(url: string, filename: string) {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      })
      .catch(() => {});
  }

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

  const preonboardingTask = useMemo(() => {
    if (!preonboardingDashboardData?.candidate_application_id) return null;
    const progress = preonboardingDashboardData.progress;
    const allSubmitted = progress.required_count > 0 && progress.required_submitted === progress.required_count;
    const allVerified = preonboardingDashboardData.requirements.every(
      (r) => !r.required || r.status === "verified" || r.status === "carried_over",
    );
    let taskStatus: "pending" | "submitted" | "graded";
    if (allVerified) taskStatus = "graded";
    else if (allSubmitted) taskStatus = "submitted";
    else taskStatus = "pending";

    const app = applications.find((a) => a.id === preonboardingDashboardData.candidate_application_id);
    return {
      id: preonboardingDashboardData.candidate_application_id,
      job_title: app?.job_title || "",
      assessment_type_label: "Preonboarding Requirements",
      task_status: taskStatus,
      scheduled_date: "",
      candidate_application_id: preonboardingDashboardData.candidate_application_id,
      is_preonboarding: true,
    } as Task;
  }, [preonboardingDashboardData, applications]);

  const filteredTasks = useMemo(() => {
    const allTasks = preonboardingTask ? [preonboardingTask, ...tasks] : tasks;
    return allTasks.filter((t) => t.task_status === taskFilter);
  }, [tasks, preonboardingTask, taskFilter]);

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

  async function handleUploadSigned(offerId: number) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploadingId(offerId);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axiosPrivate.post("/api/candidate/job-offers/upload-signed/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUploadedFileIds((prev) => ({ ...prev, [offerId]: res.data.id }));
      } catch {
        // handled by interceptor
      } finally {
        setUploadingId(null);
      }
    };
    input.click();
  }

  async function handleAccept(offerId: number) {
    const fileId = uploadedFileIds[offerId];
    if (!fileId) return;
    setAcceptingId(offerId);
    try {
      await axiosPrivate.patch("/api/candidate/job-offers/sign/", {
        job_offer_id: offerId,
        signed_document_id: fileId,
      });
      // Refetch to update status
      window.location.reload();
    } catch {
      // handled by interceptor
    } finally {
      setAcceptingId(null);
    }
  }

  function handleDeclineClick(offerId: number) {
    setDeclineOfferId(offerId);
    setDeclineReason("");
    setShowDeclineModal(true);
  }

  async function handleDeclineConfirm() {
    if (declineOfferId == null) return;
    try {
      await axiosPrivate.patch("/api/candidate/job-offers/decline/", {
        job_offer_id: declineOfferId,
        reason: declineReason,
      });
      setShowDeclineModal(false);
      setDeclineOfferId(null);
      setDeclineReason("");
      window.location.reload();
    } catch {
      // handled by interceptor
    }
  }

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
                          <th className="px-4 py-3 text-center font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                              No {taskFilter} tasks.
                            </td>
                          </tr>
                        ) : (
                          filteredTasks.map((task) => (
                            <tr key={`${task.is_preonboarding ? "pre" : "task"}-${task.id}`} className="border-t hover:bg-gray-50">
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
                              <td className="px-4 py-3 text-center">
                                {task.is_preonboarding ? (
                                  <Button
                                    size="sm"
                                    className="bg-[#0056d2] hover:bg-blue-700 text-white text-xs"
                                    onClick={() => navigate("/candidate/preonboarding")}
                                  >
                                    View
                                  </Button>
                                ) : (
                                  <span className="text-gray-300">—</span>
                                )}
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
                        <th className="px-4 py-3 text-left font-semibold">Offer</th>
                        <th className="px-4 py-3 text-left font-semibold">Action</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
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
                            {offer.offer_document_url ? (
                              <button onClick={() => handleDownload(offer.offer_document_url!, `Offer_${offer.reference_id || offer.id}.pdf`)}
                                className="text-blue-600 underline text-xs hover:text-blue-800 bg-transparent border-none p-0 cursor-pointer">
                                Download Offer
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                            {offer.signed_document_url && (
                              <a href={offer.signed_document_url} target="_blank" rel="noopener noreferrer"
                                className="block text-blue-600 underline text-xs hover:text-blue-800 mt-1">
                                View Signed
                              </a>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {offer.status === "sent" && (
                              <div className="flex flex-col gap-2">
                                {uploadedFileIds[offer.id] ? (
                                  <span className="text-xs text-green-700 font-medium">✅ Signed file uploaded</span>
                                ) : (
                                  <button onClick={() => handleUploadSigned(offer.id)} disabled={uploadingId === offer.id}
                                    className="px-3 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:opacity-50">
                                    {uploadingId === offer.id ? "Uploading..." : "Upload Signed"}
                                  </button>
                                )}
                                <div className="flex gap-2">
                                  <button onClick={() => handleAccept(offer.id)}
                                    disabled={!uploadedFileIds[offer.id] || acceptingId === offer.id}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {acceptingId === offer.id ? "Accepting..." : "Accept"}
                                  </button>
                                  <button onClick={() => handleDeclineClick(offer.id)}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">
                                    Reject
                                  </button>
                                </div>
                              </div>
                            )}
                            {offer.status === "signed" && (
                              <span className="text-xs text-green-700 font-medium">Accepted</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              offer.status === "signed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              {offer.status === "signed" ? "Signed" : "Sent"}
                            </span>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Decline Modal */}
              {showDeclineModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeclineModal(false)} />
                  <div className="relative z-10 w-full max-w-md mx-4">
                    <div className="bg-white rounded-lg shadow-xl p-6">
                      <h2 className="text-lg font-semibold text-blue-600 mb-4">Decline Job Offer</h2>
                      <p className="text-gray-700 mb-4">Are you sure you want to decline this job offer?</p>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason <span className="text-red-500">*</span></label>
                        <textarea value={declineReason} onChange={(e) => setDeclineReason(e.target.value)}
                          className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Please provide a reason for declining..." required />
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowDeclineModal(false)}
                          className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50">Cancel</Button>
                        <Button onClick={handleDeclineConfirm} disabled={!declineReason.trim()}
                          className="bg-red-600 text-white hover:bg-red-700">
                          Confirm Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Documents Section */
            <section>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-bold text-[#0056d2]">Documents</h2>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleDocUpload}
              />

              {docsLoading ? (
                <div className="text-center py-12 text-gray-500">Loading documents...</div>
              ) : (
                <div className="flex gap-4 h-[600px]">
                  {/* Left Panel - Document List */}
                  <div className="w-80 flex-shrink-0 bg-white rounded-lg border overflow-hidden flex flex-col">
                    <div className="p-3 border-b bg-gray-50">
                      <p className="text-sm font-medium text-gray-700">Required Documents</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {REQUIRED_DOCUMENTS.map((docReq) => {
                        const uploadedDoc = documents.find((d) =>
                          docReq.keywords.some((kw) =>
                            (d.original_filename || d.filename).toLowerCase().includes(kw),
                          ),
                        );
                        const isSelected = selectedDocReq?.label === docReq.label;
                        return (
                          <button
                            key={docReq.label}
                            onClick={() => setSelectedDocReq(docReq)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                              isSelected
                                ? "bg-orange-50 border border-orange-200"
                                : "hover:bg-gray-50 border border-transparent"
                            }`}
                          >
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${
                                uploadedDoc ? "text-emerald-700" : "text-orange-600"
                              }`}>
                                {docReq.label}
                              </p>
                              {uploadedDoc && (
                                <p className="text-xs text-emerald-600 truncate">
                                  {uploadedDoc.original_filename || uploadedDoc.filename}
                                </p>
                              )}
                            </div>
                            <span className="text-red-500 text-sm flex-shrink-0">*</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Panel - Preview/Upload */}
                  <div className="flex-1 bg-white rounded-lg border overflow-hidden flex flex-col">
                    {selectedDocReq ? (() => {
                      const uploadedDoc = documents.find((d) =>
                        selectedDocReq.keywords.some((kw) =>
                          (d.original_filename || d.filename).toLowerCase().includes(kw),
                        ),
                      );
                      return (
                        <>
                          <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{selectedDocReq.label}</h3>
                              {uploadedDoc && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Uploaded: {uploadedDoc.original_filename || uploadedDoc.filename}
                                </p>
                              )}
                            </div>
                            {uploadedDoc && (
                              <div className="flex gap-2">
                                <a href={uploadedDoc.file_url} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm" variant="outline" className="text-xs">
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </Button>
                                </a>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs"
                                  onClick={() => {
                                    deleteDocMutation.mutate(uploadedDoc.id, {
                                      onSuccess: () => {
                                        setTimeout(() => fileInputRef.current?.click(), 300);
                                      },
                                    });
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <Upload className="h-3 w-3 mr-1" />
                                  Replace
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 overflow-auto p-4">
                            {uploadedDoc ? (
                              uploadedDoc.file_url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) ? (
                                <img
                                  src={uploadedDoc.file_url}
                                  alt={uploadedDoc.original_filename}
                                  className="w-full h-auto rounded border"
                                />
                              ) : (
                                <iframe
                                  src={uploadedDoc.file_url}
                                  className="w-full h-full min-h-[500px] rounded border"
                                  title={uploadedDoc.original_filename}
                                />
                              )
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg">
                                <FileText className="h-12 w-12 text-gray-300 mb-3" />
                                <p className="text-gray-500 mb-4">No document uploaded yet</p>
                                <Button
                                  onClick={() => fileInputRef.current?.click()}
                                  className="bg-[#0056d2] hover:bg-blue-700 text-white"
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Document
                                </Button>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })() : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <FileText className="h-16 w-16 mb-3" />
                        <p className="text-lg">Select a document to preview</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
