import { Navbar } from "@/components/reusables/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, ExternalLink, RotateCcw, Archive, Trash2, Pause, Unlock } from "lucide-react"; // Import Unlock icon
import { ShareModal } from "@/components/ui/ShareModal";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { User, Users2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { // Import Select components
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface BaseJobPosting {
  id: number;
  title: string;
  department: string;
  description: string;
  status?: string;
  assignee?: string;
  progress?: { completed: number; total: number };
  link?: string;
  type?: "Internal" | "External";
}

type JobPosting = BaseJobPosting;

// Dummy data (different data per tab)
const initialJobData = {
  drafts: [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      description:
        "We are seeking an experienced Frontend Developer to join our engineering team and build cutting-edge user interfaces.",
      status: "Reopened",
    },
    {
      id: 2,
      title: "Product Marketing Manager",
      department: "Marketing",
      description:
        "Looking for a strategic Product Marketing Manager to drive go-to-market initiatives and product positioning.",
    },
    {
      id: 3,
      title: "Data Scientist",
      department: "Analytics",
      description:
        "Join our analytics team to extract insights from complex datasets and drive data-driven decision making.",
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "Design",
      description:
        "We need a creative UX/UI Designer to craft intuitive and beautiful user experiences for our products.",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      department: "Engineering",
      description: "Seeking a DevOps Engineer to optimize our infrastructure and streamline deployment processes.",
    },
    {
      id: 6,
      title: "Business Analyst",
      department: "Operations",
      description: "Business Analyst to bridge the gap between business requirements and technical solutions.",
    },
    {
      id: 7,
      title: "Security Engineer",
      department: "Engineering",
      description: "Cybersecurity expert to protect our systems and implement security best practices.",
    },
  ],

  "on-hold": [
    {
      id: 21,
      title: "Mobile App Developer",
      department: "Engineering",
      description: "iOS/Android developer to build native mobile applications for our growing user base....",
    },
    {
      id: 22,
      title: "Brand Manager",
      department: "Marketing",
      description:
        "Brand Manager to oversee brand strategy and maintain consistent messaging across all touchpoints....",
    },
    {
      id: 23,
      title: "Quality Assurance Engineer",
      department: "Engineering",
      description: "QA Engineer to ensure product quality through comprehensive testing and automation....",
    },
    {
      id: 24,
      title: "Operations Manager",
      department: "Operations",
      description:
        "Operations Manager to streamline processes and improve operational efficiency across departments....",
    },
    {
      id: 25,
      title: "Legal Counsel",
      department: "Legal",
      description: "In-house Legal Counsel to handle contracts, compliance, and corporate legal matters....",
    },
    {
      id: 26,
      title: "Research Scientist",
      department: "R&D",
      description: "Research Scientist to lead innovative research projects and explore new technologies....",
    },
  ],

  published: {
    Internal: [
      {
        id: 31,
        title: "Senior Account Executive",
        department: "Sales",
        description:
          "Internal promotion opportunity for Account Executive to manage enterprise client relationships and drive revenue growth...",
        type: "Internal" as const,
      },
      {
        id: 32,
        title: "Lead Software Engineer",
        department: "Engineering",
        description:
          "Internal advancement opportunity for Software Engineer to lead technical initiatives and mentor junior developers...",
        type: "Internal" as const,
      },
      {
        id: 33,
        title: "Marketing Team Lead",
        department: "Marketing",
        description:
          "Internal leadership role for Digital Marketing Manager to lead our online marketing efforts and team expansion...",
        type: "Internal" as const,
      },
      {
        id: 34,
        title: "Senior Product Manager",
        department: "Product",
        description:
          "Internal promotion for Product Manager to define product roadmap and lead cross-functional initiatives...",
        type: "Internal" as const,
      },
      {
        id: 35,
        title: "Principal Data Scientist",
        department: "Analytics",
        description:
          "Internal advancement for Data Scientist to lead analytics strategy and advanced modeling projects...",
        type: "Internal" as const,
      },
      {
        id: 36,
        title: "Design Team Lead",
        department: "Design",
        description:
          "Internal promotion for UX Designer to lead design team and establish design systems across products...",
        type: "Internal" as const,
      },
      {
        id: 37,
        title: "Senior DevOps Engineer",
        department: "Engineering",
        description:
          "Internal advancement for DevOps Engineer to architect cloud infrastructure and lead automation initiatives...",
        type: "Internal" as const,
      },
      {
        id: 38,
        title: "Customer Success Team Lead",
        department: "Customer Success",
        description: "Internal promotion to lead customer success team and develop retention strategies...",
        type: "Internal" as const,
      },
      {
        id: 39,
        title: "Senior Business Analyst",
        department: "Operations",
        description: "Internal advancement for Business Analyst to lead process optimization and strategic planning...",
        type: "Internal" as const,
      },
      {
        id: 40,
        title: "HR Manager",
        department: "Human Resources",
        description:
          "Internal promotion for HR Business Partner to manage HR operations and talent development programs...",
        type: "Internal" as const,
      },
    ],
    External: [
      {
        id: 41,
        title: "Technical Writer",
        department: "Documentation",
        description:
          "External hire for Technical Writer to create comprehensive documentation and user guides for our products and APIs...",
        type: "External" as const,
      },
      {
        id: 42,
        title: "Site Reliability Engineer",
        department: "Engineering",
        description:
          "External SRE position to ensure system reliability, performance monitoring, and incident response management...",
        type: "External" as const,
      },
      {
        id: 43,
        title: "Growth Marketing Manager",
        department: "Marketing",
        description:
          "External hire for Growth Marketing Manager to drive user acquisition, retention, and revenue growth through data-driven campaigns...",
        type: "External" as const,
      },
      {
        id: 44,
        title: "Solutions Architect",
        department: "Engineering",
        description:
          "External Solutions Architect to design scalable system architectures for enterprise clients and complex integrations...",
        type: "External" as const,
      },
      {
        id: 45,
        title: "Customer Experience Manager",
        department: "Customer Success",
        description:
          "External hire to lead customer experience initiatives, improve satisfaction metrics, and develop customer journey optimization...",
        type: "External" as const,
      },
      {
        id: 46,
        title: "Data Analytics Manager",
        department: "Analytics",
        description:
          "External manager position to lead data analytics team, drive insights, and establish data governance practices...",
        type: "External" as const,
      },
      {
        id: 47,
        title: "Cybersecurity Specialist",
        department: "Security",
        description:
          "External cybersecurity expert to implement security protocols, conduct risk assessments, and manage compliance requirements...",
        type: "External" as const,
      },
      {
        id: 48,
        title: "Financial Controller",
        department: "Finance",
        description:
          "External hire for Financial Controller to oversee financial reporting, budgeting, and compliance with regulatory requirements...",
        type: "External" as const,
      },
      {
        id: 49,
        title: "Legal Counsel",
        department: "Legal",
        description:
          "External Legal Counsel to handle contracts, intellectual property, regulatory compliance, and corporate governance matters...",
        type: "External" as const,
      },
      {
        id: 50,
        title: "Talent Acquisition Manager",
        department: "Human Resources",
        description:
          "External hire for Talent Acquisition Manager to lead recruitment strategy, build talent pipelines, and enhance employer branding...",
        type: "External" as const,
      },
      {
        id: 51,
        title: "Product Marketing Manager",
        department: "Marketing",
        description:
          "External Product Marketing Manager to develop go-to-market strategies, competitive analysis, and product positioning...",
        type: "External" as const,
      },
      {
        id: 52,
        title: "Cloud Infrastructure Engineer",
        department: "Engineering",
        description:
          "External Cloud Engineer to design and implement scalable cloud solutions, optimize costs, and ensure high availability...",
        type: "External" as const,
      },
      {
        id: 53,
        title: "Business Development Manager",
        department: "Business Development",
        description:
          "External BD Manager to identify partnership opportunities, negotiate strategic alliances, and drive revenue growth...",
        type: "External" as const,
      },
      {
        id: 54,
        title: "Quality Assurance Manager",
        department: "Quality Assurance",
        description:
          "External QA Manager to establish testing frameworks, lead quality initiatives, and ensure product reliability...",
        type: "External" as const,
      },
      {
        id: 55,
        title: "Research and Development Lead",
        department: "R&D",
        description:
          "External R&D Lead to drive innovation initiatives, explore emerging technologies, and lead experimental projects...",
        type: "External" as const,
      },
    ],
  },

  closed: [
    {
      id: 61,
      title: "Marketing Coordinator",
      department: "Marketing",
      description: "Entry-level Marketing Coordinator to support marketing campaigns and event coordination.",
      status: "Reopened",
    },
    {
      id: 62,
      title: "Junior Developer",
      department: "Engineering",
      description: "Junior Developer position for recent graduates to start their career in software development.",
    },
    {
      id: 63,
      title: "Sales Intern",
      department: "Sales",
      description: "Summer internship opportunity in sales to gain hands-on experience in B2B sales.",
    },
    {
      id: 64,
      title: "Graphic Designer",
      department: "Design",
      description: "Graphic Designer to create visual assets for marketing materials and digital campaigns.",
    },
    {
      id: 65,
      title: "Administrative Assistant",
      department: "Operations",
      description: "Administrative Assistant to provide executive support and manage office operations.",
    },
    {
      id: 66,
      title: "Social Media Manager",
      department: "Marketing",
      description: "Social Media Manager to manage our social media presence and community engagement.",
    },
    {
      id: 67,
      title: "IT Support Specialist",
      department: "IT",
      description: "IT Support Specialist to provide technical support and maintain office technology systems.",
    },
  ],

  archive: [
    {
      id: 71,
      title: "Legacy System Administrator",
      department: "IT",
      description:
        "System Administrator role for maintaining legacy infrastructure (position archived due to system migration).",
    },
    {
      id: 72,
      title: "Regional Sales Manager",
      department: "Sales",
      description: "Regional Sales Manager position for European market expansion (archived due to strategy change).",
    },
    {
      id: 73,
      title: "Print Marketing Specialist",
      department: "Marketing",
      description: "Specialist for traditional print marketing campaigns (archived due to digital-first strategy).",
    },
    {
      id: 74,
      title: "Flash Developer",
      department: "Engineering",
      description: "Flash Developer for interactive web content (archived due to technology deprecation).",
    },
    {
      id: 75,
      title: "Telemarketing Representative",
      department: "Sales",
      description: "Telemarketing role for cold calling campaigns (archived due to strategy pivot).",
    },
  ],
  deleted: [
    {
      id: 81,
      title: "Internship Program Coordinator",
      department: "Human Resources",
      description: "Coordinator for managing our annual internship program (deleted due to restructuring).",
    },
    {
      id: 82,
      title: "Customer Support Tier 1",
      department: "Customer Success",
      description: "Entry-level customer support role (deleted due to automation of common queries).",
    },
    {
      id: 83,
      title: "Office Administrator",
      department: "Operations",
      description: "General office administration and supplies management (deleted, responsibilities merged).",
    },
    {
      id: 84,
      title: "Junior Data Entry Clerk",
      department: "Administration",
      description: "Data entry and record keeping (deleted, replaced by automated systems).",
    },
    {
      id: 85,
      title: "Event Planner",
      department: "Marketing",
      description: "Planning and execution of company events (deleted due to shift to virtual events).",
    },
  ],
};

// Interviewers for pending jobs
const assignees = ["Joseph Santos", "Virla Getalado", "Choi Beomgyu", "Kang Taehyun", "Flynn Rider", "Choi Yeonjun"];

const getRandomProgress = () => {
  // Generate a random total number of interviews (1 to 5)
  const totalSteps = Math.floor(Math.random() * 5) + 1;

  // Generate a random completion level (0 to totalSteps completed)
  const completedSteps = Math.floor(Math.random() * (totalSteps + 1));

  return { completed: completedSteps, total: totalSteps };
};

const generateJobLink = (title: string) => {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return `https://oodc.yourcompany.com/jobs/${slug}`;
};

const getDepartmentColor = (department: string) => {
  switch (department) {
    case "Marketing":
      return "bg-blue-100 text-blue-700";
    case "Engineering":
      return "bg-purple-100 text-purple-700";
    case "Sales":
      return "bg-green-100 text-green-700";
    case "Design":
      return "bg-pink-100 text-pink-700";
    case "Analytics":
      return "bg-orange-100 text-orange-700";
    case "Customer Success":
      return "bg-teal-100 text-teal-700";
    case "Finance":
      return "bg-yellow-100 text-yellow-700";
    case "Human Resources":
      return "bg-indigo-100 text-indigo-700";
    case "Operations":
      return "bg-gray-100 text-gray-700";
    case "Product":
      return "bg-red-100 text-red-700";
    case "Documentation":
      return "bg-cyan-100 text-cyan-700";
    case "IT":
      return "bg-slate-100 text-slate-700";
    case "Business Development":
      return "bg-emerald-100 text-emerald-700";
    case "Legal":
      return "bg-amber-100 text-amber-700";
    case "R&D":
      return "bg-violet-100 text-violet-700";
    case "Security":
      return "bg-red-100 text-red-800";
    case "Quality Assurance":
      return "bg-green-100 text-green-800";
    case "Administration":
      return "bg-stone-100 text-stone-700"; // New color for Administration
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const ProgressBar = ({ progress, assignee }: { progress: { completed: number; total: number }; assignee: string }) => {
  // Colors for each interview
  const segmentColors = [
    "bg-blue-500", // Step 1
    "bg-blue-600", // Step 2
    "bg-blue-700", // Step 3
    "bg-blue-800", // Step 4
    "bg-blue-900", // Step 5
  ];

  // Use actual total for number of interview
  const numberOfSegments = progress.total;

  // Fixed total width for all progress bars
  const totalWidth = 90; // pixels
  const segmentWidth = Math.floor(totalWidth / numberOfSegments);

  // Find the index of the last completed segment for hover functionality
  const lastCompletedIndex = progress.completed > 0 ? progress.completed - 1 : -1;

  return (
    <div className="flex flex-col items-end gap-1 mt-1">
      <span className="text-xs text-gray-500 font-medium">
        {progress.completed}/{progress.total} completed
      </span>
      <div className="flex bg-gray-200 rounded-full p-1 shadow-inner" style={{ width: `${totalWidth}px` }}>
        {Array.from({ length: numberOfSegments }, (_, index) => (
          <div
            key={index}
            className={`relative h-3 ${index < progress.completed ? segmentColors[index] : "bg-gray-300"} ${
              index === 0 ? "rounded-l-full" : index === numberOfSegments - 1 ? "rounded-r-full" : ""
            } ${index > 0 ? "ml-0.5" : ""} transition-all duration-300 ease-in-out ${
              index === lastCompletedIndex && index < progress.completed ? "group cursor-pointer" : ""
            }`}
            style={{ width: `${segmentWidth - (index > 0 ? 2 : 0)}px` }}
          >
            {/* Hover effect on the last accomplished interview */}
            {index === lastCompletedIndex && index < progress.completed && (
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                {assignee}
                <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Positions() {
  const navigate = useNavigate();

  // Get current tab from URL path or default to 'drafts'
  const getCurrentTab = () => {
    const path = window.location.pathname;
    const tabFromPath = path.split("/positions/")[1] || "drafts";
    return tabFromPath;
  };

  const [currentTab, setCurrentTab] = useState(getCurrentTab());
  const [publishedSubTab, setPublishedSubTab] = useState<"all" | "Internal" | "External">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // State for filter dropdowns
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("all");


  // State to hold all job postings, allowing modifications
  const [allPositions, setAllPositions] = useState(() => {
    // Initialize with generated data, ensuring published 'all' is correctly set
    const generated = {
      drafts: initialJobData.drafts,
      "on-hold": initialJobData["on-hold"],
      published: {
        Internal: initialJobData.published.Internal.map((job) => ({
          ...job,
          link: generateJobLink(job.title),
        })),
        External: initialJobData.published.External.map((job) => ({
          ...job,
          link: generateJobLink(job.title),
        })),
        all: [] as JobPosting[], // Explicitly type 'all' as an array of JobPosting
      },
      closed: initialJobData.closed,
      archive: initialJobData.archive,
      deleted: initialJobData.deleted,
    };
    generated.published.all = [...generated.published.Internal, ...generated.published.External];
    return generated;
  });

  // Dialog states for various actions
  const [showMoveToDeletedDialog, setShowMoveToDeletedDialog] = useState(false);
  const [showOpenPositionsDialog, setShowOpenPositionsDialog] = useState(false);
  const [showArchivePositionsDialog, setShowArchivePositionsDialog] = useState(false);
  const [showHoldPositionsDialog, setShowHoldPositionsDialog] = useState(false);
  const [showRestorePositionsDialog, setShowRestorePositionsDialog] = useState(false);
  const [showDeletePermanentlyDialog, setShowDeletePermanentlyDialog] = useState(false);

  // Update current tab when URL changes
  useEffect(() => {
    const newTab = getCurrentTab();
    setCurrentTab(newTab);
    document.title = `Positions | ${newTab.charAt(0).toUpperCase() + newTab.slice(1).replace("-", " ")}`;
  }, [currentTab]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    navigate(`/positions/${value}`);
    setSelected([]); // Clear selection when changing tabs
    // Reset published subtab when changing main tabs
    if (value !== "published") {
      setPublishedSubTab("all");
    }
    document.title = `Positions | ${value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ")}`;
  };

  const getCurrentData = (): JobPosting[] => {
    if (currentTab === "published") {
      return allPositions.published?.[publishedSubTab] ?? [];
    }
    const tabData = allPositions[currentTab as keyof typeof allPositions];
    return Array.isArray(tabData) ? tabData : [];
  };

  const currentData: JobPosting[] = getCurrentData();

  const filteredPostings = currentData.filter((posting: JobPosting) =>
    posting.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelectAllToggle = () => {
    if (selected.length === filteredPostings.length && filteredPostings.length > 0) {
      setSelected([]);
    } else {
      setSelected(filteredPostings.map((_, idx) => idx));
    }
  };

  const handleShareClick = (link: string) => {
    setSelectedLink(link);
    setShareOpen(true);
  };

  const handleCancelRequest = () => {
    setSelected([]);
    setShowCancelDialog(false);
  };

  // --- Action Handlers for moving jobs between tabs ---

  const moveSelectedJobs = (
    sourceTabName: keyof typeof allPositions | "publishedInternal" | "publishedExternal",
    destinationTabName: keyof typeof allPositions | "publishedInternal" | "publishedExternal" | "published",
  ) => {
    setAllPositions((prevPositions) => {
      const newPositions = JSON.parse(JSON.stringify(prevPositions)); // Deep copy to avoid direct mutation issues
      const selectedJobsToMove: JobPosting[] = selected.map(idx => filteredPostings[idx]);
      const selectedJobIds = new Set(selectedJobsToMove.map(job => job.id));

      // Remove selected jobs from their original source arrays
      if (sourceTabName === "publishedInternal") {
        newPositions.published.Internal = newPositions.published.Internal.filter(
          (job: JobPosting) => !selectedJobIds.has(job.id)
        );
      } else if (sourceTabName === "publishedExternal") {
        newPositions.published.External = newPositions.published.External.filter(
          (job: JobPosting) => !selectedJobIds.has(job.id)
        );
      } else if (sourceTabName === "published") { // This case is for when 'all' subtab is active in Published
        newPositions.published.Internal = newPositions.published.Internal.filter(
          (job: JobPosting) => !selectedJobIds.has(job.id)
        );
        newPositions.published.External = newPositions.published.External.filter(
          (job: JobPosting) => !selectedJobIds.has(job.id)
        );
      }
      else { // For other top-level tabs like 'drafts', 'on-hold', 'closed', 'archive', 'deleted'
        if (Array.isArray(newPositions[sourceTabName])) {
            newPositions[sourceTabName] = (newPositions[sourceTabName] as JobPosting[]).filter(
            (job: JobPosting) => !selectedJobIds.has(job.id)
          );
        }
      }

      // Add selected jobs to the destination tab
      if (destinationTabName === "publishedInternal" || destinationTabName === "publishedExternal" || destinationTabName === "published") {
        selectedJobsToMove.forEach(job => {
          // Preserve original type if available, otherwise default to Internal
          const targetType = job.type || "Internal"; 
          const jobWithLink = { ...job, type: targetType, link: generateJobLink(job.title) };

          if (targetType === "Internal") {
            newPositions.published.Internal.push(jobWithLink);
          } else { // targetType === "External"
            newPositions.published.External.push(jobWithLink);
          }
        });
      } else if (destinationTabName === "deleted" || destinationTabName === "archive" || destinationTabName === "on-hold") {
        newPositions[destinationTabName] = [...(newPositions[destinationTabName] as JobPosting[]), ...selectedJobsToMove];
      }

      // Re-calculate the 'all' sub-tab for published
      newPositions.published.all = [...newPositions.published.Internal, ...newPositions.published.External];

      return newPositions;
    });
    setSelected([]); // Clear selection after action
  };

  // Handlers for specific dialogs
  const handleMoveToDeleted = () => {
    moveSelectedJobs(currentTab as keyof typeof allPositions, "deleted");
    setShowMoveToDeletedDialog(false);
  };

  const handleOpenPositions = () => {
    // No need to pass newType, it's handled by preserving original job.type
    moveSelectedJobs("on-hold", "published");
    setShowOpenPositionsDialog(false);
  };

  const handleArchivePositions = () => {
    // Determine the correct source sub-tab for published based on current sub-tab
    let sourceTab: keyof typeof allPositions | "publishedInternal" | "publishedExternal" = "published"; // Default to 'published' if not internal/external
    if (publishedSubTab === "Internal") {
      sourceTab = "publishedInternal";
    } else if (publishedSubTab === "External") {
      sourceTab = "publishedExternal";
    } else if (publishedSubTab === "all") {
      sourceTab = "published";
    }

    moveSelectedJobs(sourceTab, "archive");
    setShowArchivePositionsDialog(false);
  };

  const handleHoldPositions = () => {
    // Determine the correct source sub-tab for published based on current sub-tab
    let sourceTab: keyof typeof allPositions | "publishedInternal" | "publishedExternal" = "published"; // Default to 'published' if not internal/external
    if (publishedSubTab === "Internal") {
      sourceTab = "publishedInternal";
    } else if (publishedSubTab === "External") {
      sourceTab = "publishedExternal";
    } else if (publishedSubTab === "all") {
      sourceTab = "published";
    }
    moveSelectedJobs(sourceTab, "on-hold");
    setShowHoldPositionsDialog(false);
  };

  const handleRestorePositions = () => {
    // Restore from archive or deleted to On Hold tab
    moveSelectedJobs(currentTab as keyof typeof allPositions, "on-hold");
    setShowRestorePositionsDialog(false);
  };

  const handleDeletePermanently = () => {
    setAllPositions((prevPositions) => {
      const newPositions = { ...prevPositions };
      const remainingPostings = (newPositions.deleted as JobPosting[]).filter(
        (_, idx) => !selected.includes(idx),
      );
      newPositions.deleted = remainingPostings;
      return newPositions;
    });
    setSelected([]); // Clear selection after deletion
    setShowDeletePermanentlyDialog(false); // Close the dialog after deletion
  };

  const renderActionButton = (posting: JobPosting) => {
    // Only show default actions when no items are selected
    if (selected.length > 0) {
      return null;
    }
    switch (currentTab) {
      case "drafts":
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            onClick={() => navigate("/positions/create-new-position")}
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        );
      case "published":
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => posting.link && handleShareClick(posting.link)}
          >
            <ExternalLink className="w-4 h-4 text-gray-500 hover:text-blue-600" />
          </div>
        );
      case "closed":
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            onClick={() => navigate("/positions/create-new-position")}
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        );
      default:
        return null;
    }
  };

  const renderRightContent = (posting: JobPosting, idx: number) => {
    // Only show default actions when no items are selected
    if (selected.length > 0) {
      return null;
    }

    return renderActionButton(posting);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-[100px] bg-gray-50"> {/* Adjusted pt for fixed header */}
        {/* Fixed top filter/search section */}
        <div className="fixed top-[64px] left-0 right-0 z-20 bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
          <div className="max-w-7xl mx-auto space-y-3"> {/* Adjusted space-y */}
            <h1 className="text-3xl font-bold text-gray-800">Positions</h1>

            {/* Filters */}
            <div className="flex flex-wrap justify-between items-center gap-4"> {/* Changed gap to gap-4 */}
              <Input
                placeholder="Search positions..." // Updated placeholder
                className="w-64" // Fixed width for consistency
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 ml-auto">
                <Select value={selectedOffice} onValueChange={setSelectedOffice}>
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="All Offices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Offices</SelectItem>
                    {/* Add more SelectItem components for specific offices if needed */}
                  </SelectContent>
                </Select>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {/* Add more SelectItem components for specific departments if needed */}
                  </SelectContent>
                </Select>
                <Select value={selectedEmploymentType} onValueChange={setSelectedEmploymentType}>
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="All Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employment Type</SelectItem>
                    {/* Add more SelectItem components for specific employment types if needed */}
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                      Add New Position
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="text-center">
                    <DialogHeader>
                      <DialogTitle className="text-blue-700 text-sm font-semibold">SELECT TYPE OF HIRING</DialogTitle>
                    </DialogHeader>

                    <div className="flex justify-center gap-12 mt-6">
                      {/* Internal Hiring */}
                      <div
                        className="flex flex-col items-center space-y-2 cursor-pointer group"
                        onClick={() => navigate("/prf")}
                      >
                        <div className="w-16 h-16 rounded-full border border-gray-500 text-gray-600 flex items-center justify-center group-hover:border-blue-500 group-hover:text-blue-500">
                          <User className="w-6 h-6" />
                        </div>
                        <span className="text-sm text-gray-600  font-medium group-hover:text-blue-500">
                          Internal Hiring
                        </span>
                      </div>

                      {/* Client */}
                      <div
                        className="flex flex-col items-center space-y-2 cursor-pointer group"
                        onClick={() => navigate("/positions/create-new-position")}
                      >
                        <div className="w-16 h-16 rounded-full border border-gray-500 text-gray-600 group-hover:border-blue-500 group-hover:text-blue-500 flex items-center justify-center">
                          <Users2 className="w-6 h-6" />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-blue-500 font-medium">Client</span>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Main content section */}
        <main className="flex-grow px-6 pt-[120px] pb-[80px] max-w-7xl mx-auto w-full"> {/* Adjusted pt for main content */}
          {/* Select All Row */}
          <div className="flex justify-between items-center pb-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
                  checked={selected.length === filteredPostings.length && filteredPostings.length > 0}
                  onChange={handleSelectAllToggle}
                />
                Select All
              </label>
            </div>
            {/* Action Icons - appear when items are selected, aligned with tabs */}
            {selected.length > 0 && (
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  {(currentTab === "drafts" || currentTab === "closed" || currentTab === "archive") && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => setShowMoveToDeletedDialog(true)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {currentTab === "on-hold" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-50"
                          onClick={() => setShowOpenPositionsDialog(true)}
                        >
                          <Unlock className="w-4 h-4" /> {/* Open-lock icon */}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {currentTab === "published" && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:bg-gray-50"
                            onClick={() => setShowArchivePositionsDialog(true)}
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Archive</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:bg-gray-50"
                            onClick={() => setShowHoldPositionsDialog(true)}
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hold</p>
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}

                  {currentTab === "archive" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-50"
                          onClick={() => setShowRestorePositionsDialog(true)}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Restore</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {currentTab === "deleted" && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => setShowRestorePositionsDialog(true)} // Restore from deleted to on-hold
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Restore</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => setShowDeletePermanentlyDialog(true)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Permanently</p>
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
              </TooltipProvider>
            )}
          </div>

          {/* Tabs Row */}
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex flex-col gap-4">
              <Tabs value={currentTab} onValueChange={handleTabChange} className="w-auto">
                <TabsList className="flex gap-4 bg-transparent border-b-0">
                  {["drafts", "on-hold", "published", "closed", "archive", "deleted"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="relative px-2 pb-2 text-sm font-medium text-gray-500 data-[state=active]:text-blue-600"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
                      <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-blue-600 scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left" />
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Published Subtabs */}
              {currentTab === "published" && (
                <Tabs
                  value={publishedSubTab}
                  onValueChange={(value) => setPublishedSubTab(value as "all" | "Internal" | "External")}
                  className="w-auto"
                >
                  <TabsList className="flex gap-4 bg-transparent border-b-0 ml-4">
                    {["all", "Internal", "External"].map((subtab) => (
                      <TabsTrigger
                        key={subtab}
                        value={subtab}
                        className="relative px-2 pb-2 text-xs font-medium text-gray-400 data-[state=active]:text-blue-500"
                      >
                        {subtab.charAt(0).toUpperCase() + subtab.slice(1)}
                        <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-blue-500 scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left" />
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              )}
            </div>
          </div>

          {/* Postings */}
          <div className="space-y-2">
            {filteredPostings.length > 0 ? (
              filteredPostings.map((posting: JobPosting, idx: number) => (
                <Card key={posting.id} className="p-4 shadow-sm hover:shadow-md transition border rounded-md">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          className="mt-1 w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
                          checked={selected.includes(idx)}
                          onChange={() =>
                            setSelected((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]))
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-gray-800">{posting.title}</h3>
                          <Badge variant="secondary" className={`${getDepartmentColor(posting.department)} text-xs`}>
                            {posting.department}
                          </Badge>
                          {posting.status && (
                            <Badge className="bg-yellow-100 text-yellow-700 text-xs">{posting.status}</Badge>
                          )}
                          {currentTab === "published" && posting.type && (
                            <Badge
                              className={`text-xs ${posting.type === "Internal" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                            >
                              {posting.type}
                            </Badge>
                          )}
                          {currentTab === "deleted" && (
                            <div className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                              Deleted
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {posting.description.length > 100
                            ? posting.description.slice(0, 100) + "..."
                            : posting.description}
                        </p>
                      </div>
                    </div>
                    {renderRightContent(posting, idx)}
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">This tab is empty.</div>
            )}
          </div>
        </main>
      </div>

      <ShareModal open={shareOpen} onOpenChange={setShareOpen} link={selectedLink} />

      {/* Cancel Request Dialog (Existing) */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-800">Cancel Request</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">Are you sure you want to cancel?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              No, Keep
            </Button>
            <Button variant="destructive" onClick={handleCancelRequest}>
              Cancel request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Permanently Dialog (Existing, now used for 'deleted' tab's Trash2) */}
      <Dialog open={showDeletePermanentlyDialog} onOpenChange={setShowDeletePermanentlyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-800">Delete Permanently</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Do you want to delete {selected.length} jobs permanently?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeletePermanentlyDialog(false)}>
              No
            </Button>
            <Button variant="destructive" onClick={handleDeletePermanently}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Dialogs */}

      {/* Move to Deleted Dialog (for Drafts, Closed, Archive Trash2) */}
      <Dialog open={showMoveToDeletedDialog} onOpenChange={setShowMoveToDeletedDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-800">Move to Deleted</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Do you want to send the selected position/s to the Deleted tab?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowMoveToDeletedDialog(false)}>
              No
            </Button>
            <Button variant="destructive" onClick={handleMoveToDeleted}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Open Positions Dialog (for On Hold tab) */}
      <Dialog open={showOpenPositionsDialog} onOpenChange={setShowOpenPositionsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-800">Open Positions</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Do you want to open this position/s?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowOpenPositionsDialog(false)}>
              No
            </Button>
            <Button variant="default" onClick={handleOpenPositions}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Positions Dialog (for Published tab) */}
      <Dialog open={showArchivePositionsDialog} onOpenChange={setShowArchivePositionsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-800">Archive Positions</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Do you want to send the selected position/s to the Archive Tab?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowArchivePositionsDialog(false)}>
              No
            </Button>
            <Button variant="destructive" onClick={handleArchivePositions}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hold Positions Dialog (for Published tab) */}
      <Dialog open={showHoldPositionsDialog} onOpenChange={setShowHoldPositionsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-800">Hold Positions</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Do you want to send the selected position/s to the On Hold Tab?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowHoldPositionsDialog(false)}>
              No
            </Button>
            <Button variant="default" onClick={handleHoldPositions}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Positions Dialog (for Archive and Deleted tabs) */}
      <Dialog open={showRestorePositionsDialog} onOpenChange={setShowRestorePositionsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-800">Restore Positions</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Do you want to restore the selected position/s?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRestorePositionsDialog(false)}>
              No
            </Button>
            <Button variant="default" onClick={handleRestorePositions}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
