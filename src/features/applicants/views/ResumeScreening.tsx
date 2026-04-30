import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table.tsx";
import {
  ArrowLeft,
  Download,
  FileText,
  Search,
} from "lucide-react";
import { Navbar } from "@/shared/components/reusables/Navbar.tsx";
import { useLocation, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import ResumeScreeningTable, { Candidate } from "@/features/applicants/components/ResumeScreeningTable";

type ResumePreview = {
  fileName: string;
  summary: string;
  experience: string[];
  education: string[];
  skills: string[];
};

type Applicant = {
  id: string;
  name: string;
  avatar: string;
  department: string;
  resume: ResumePreview;
};

const buildResumePreview = (applicantName: string, department: string): ResumePreview => ({
  fileName: `${applicantName.replace(/\s+/g, "-").toLowerCase()}-resume.html`,
  summary: `${applicantName} is a detail-oriented professional in ${department} with experience supporting hiring workflows, documentation, and cross-functional collaboration.`,
  experience: [
    `Supported daily operations and reporting tasks within the ${department} team.`,
    "Prepared structured documentation and maintained clear communication with stakeholders.",
    "Worked on task coordination, follow-through, and process improvements.",
  ],
  education: ["Bachelor's Degree in a relevant field", "Professional training in workplace systems"],
  skills: ["Communication", "Documentation", "Coordination", "Teamwork", "Process Improvement"],
});

// Sample applicant data
const applicants: Applicant[] = [
  {
    id: "001",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/32?u=001",
    department: "Engineering",
    resume: buildResumePreview("John Doe", "Engineering"),
  },
  {
    id: "002",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/32?u=002",
    department: "Engineering",
    resume: buildResumePreview("Sarah Johnson", "Engineering"),
  },
  {
    id: "003",
    name: "Mike Chen",
    avatar: "https://i.pravatar.cc/32?u=003",
    department: "Engineering",
    resume: buildResumePreview("Mike Chen", "Engineering"),
  },
  {
    id: "004",
    name: "Emily Rodriguez",
    avatar: "https://i.pravatar.cc/32?u=004",
    department: "Engineering",
    resume: buildResumePreview("Emily Rodriguez", "Engineering"),
  },
  {
    id: "005",
    name: "David Kim",
    avatar: "https://i.pravatar.cc/32?u=005",
    department: "Engineering",
    resume: buildResumePreview("David Kim", "Engineering"),
  },
  {
    id: "006",
    name: "Lisa Wang",
    avatar: "https://i.pravatar.cc/32?u=006",
    department: "Engineering",
    resume: buildResumePreview("Lisa Wang", "Engineering"),
  },
  {
    id: "007",
    name: "Alex Thompson",
    avatar: "https://i.pravatar.cc/32?u=007",
    department: "Engineering",
    resume: buildResumePreview("Alex Thompson", "Engineering"),
  },
  {
    id: "008",
    name: "Maria Garcia",
    avatar: "https://i.pravatar.cc/32?u=008",
    department: "Engineering",
    resume: buildResumePreview("Maria Garcia", "Engineering"),
  },
];

const statusStyles = {
  active: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
  inactive: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
  pending:
    "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
};

export default function ResumeScreening() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("resumescreening");
  const [jobStatus, setJobStatus] = useState("active");
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const navigate = useNavigate();

  const { jobId } = useParams<{ jobId: string }>();

  // Filter applicants based on search term
  const filteredApplicants = applicants.filter((applicant) =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadResume = (applicant: Applicant) => {
    const resumeHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${applicant.name} Resume</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 32px; color: #111827; }
      h1 { margin: 0 0 8px; font-size: 28px; }
      h2 { margin: 24px 0 8px; font-size: 16px; }
      p, li { font-size: 14px; line-height: 1.6; }
      ul { margin: 0; padding-left: 20px; }
      .muted { color: #6b7280; }
      .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${applicant.name}</h1>
      <p class="muted">${applicant.department}</p>
      <h2>Professional Summary</h2>
      <p>${applicant.resume.summary}</p>
      <h2>Experience</h2>
      <ul>${applicant.resume.experience.map((item) => `<li>${item}</li>`).join("")}</ul>
      <h2>Education</h2>
      <ul>${applicant.resume.education.map((item) => `<li>${item}</li>`).join("")}</ul>
      <h2>Skills</h2>
      <ul>${applicant.resume.skills.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>
  </body>
</html>`;

    const blob = new Blob([resumeHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = applicant.resume.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatJobTitle = (slug?: string) => {
    const titleMap: Record<string, string> = {
      projectmanager: "Project Manager",
      socialcontentmanager: "Social Content Manager",
      senioruiuxdesigner: "Senior UI UX Designer",
      leaddeveloper: "Lead Developer",
      customersupport: "Customer Support",
      qaengineer: "QA Engineer",
      humanresourcescoordinator: "Human Resources Coordinator",
      operationsmanager: "Operations Manager",
      socialmediamanager: "Social Media Manager",
      marketingspecialist: "Marketing Specialist",
    };
    return slug
      ? titleMap[slug.toLowerCase()] || slug.replace(/([a-z])([A-Z])/g, "$1 $2")
      : "Unknown Job";
  };

  const location = useLocation();
  const { jobId: jobTitleParam } = useParams<{ jobId: string }>();
  const jobTitleFromState = location.state?.jobTitle;

  const rawJobTitle = jobTitleParam || jobTitleFromState;
  const resolvedJobTitle = formatJobTitle(rawJobTitle);

  // Build blob URLs for the sample applicant resumes so the preview iframe can load them.
  const [candidateList, setCandidateList] = useState<Candidate[]>([]);

  React.useEffect(() => {
    const blobs: { id: string; url: string }[] = [];

    const mapped = applicants.map((applicant) => {
      const resumeHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${applicant.name} Resume</title>
    <style>body { font-family: Arial, sans-serif; margin: 0; padding: 32px; color: #111827; } h1 { margin: 0 0 8px; }</style>
  </head>
  <body>
    <h1>${applicant.name}</h1>
    <p>${applicant.department}</p>
    <p>${applicant.resume.summary}</p>
  </body>
</html>`;

      const blob = new Blob([resumeHtml], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      blobs.push({ id: applicant.id, url });

      return {
        id: applicant.id,
        name: applicant.name,
        department: applicant.department,
        photoUrl: applicant.avatar,
        resumeUrl: url,
      } as Candidate;
    });

    setCandidateList(mapped);

    return () => {
      for (const b of blobs) URL.revokeObjectURL(b.url);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 mt-20">
        <div className="mx-auto max-w-none space-y-4">
          {/* Header Section */}
          <div className="space-y-3">
            {/* Back Button and Job Title */}
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  const from = location.state?.from;
                  if (from?.includes("/weekly")) {
                    navigate(from);
                  } else {
                    navigate(`/job/${jobId}`);
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-3">
                <h1 className="text-2xl font-bold">{resolvedJobTitle}</h1>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </div>

          <ResumeScreeningTable
            candidates={candidateList.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))}
            onPass={() => navigate(`/job/${jobId}/phonecallinterview`)}
            onFail={() => {}}
          />

          {searchTerm && (
            <div className="text-sm text-gray-600">
              Showing {candidateList.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())).length} of {applicants.length} applicants
              {searchTerm && ` for "${searchTerm}"`}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
