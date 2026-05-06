import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Navbar } from "@/shared/components/reusables/Navbar";
import { ArrowLeft, Search, Eye, CheckCircle, XCircle, Plus, Trash2 } from "lucide-react";

interface RequirementItem {
  id: string;
  label: string;
  checked: boolean;
}

interface PreOnboardingApplicant {
  id: string;
  name: string;
  position: string;
  avatar: string;
  signedDocUploaded: boolean;
  requirementsMet: number;
  requirementsTotal: number;
  status: "pending" | "passed" | "failed";
}

const defaultRequirements = [
  "Valid NBI Clearance or Police Clearance",
  "Medical Certificate",
  "Certificate of Employment (COE)",
  "Income Tax Return (ITR 2316)",
  "Barangay Clearance",
  "Photocopy of Dependents Birth Certificate (if applicable)",
  "Photocopy of Marriage Contract (if applicable)",
  "Photocopy of Birth Certificate",
  "Photocopy of BIR ID / TIN Card",
  "Photocopy of SSS ID/ E1 Form",
  "Photocopy of PhilHealth Card",
  "Photocopy of Pag-ibig ID/Certificate/Record of Contribution",
  "2 pieces of 2x2 size photo",
  "2 pieces of 1x1 size photo",
  "Photocopy of SSS and Pag-ibig loan voucher (if with current loan)",
  "Photocopy of other Government-Issued IDs",
];

const sampleApplicants: PreOnboardingApplicant[] = [
  {
    id: "001",
    name: "John Doe",
    position: "Senior Software Engineer",
    avatar: "https://i.pravatar.cc/32?u=001",
    signedDocUploaded: true,
    requirementsMet: 16,
    requirementsTotal: 16,
    status: "pending",
  },
  {
    id: "002",
    name: "Sarah Johnson",
    position: "Frontend Developer",
    avatar: "https://i.pravatar.cc/32?u=002",
    signedDocUploaded: false,
    requirementsMet: 10,
    requirementsTotal: 16,
    status: "pending",
  },
];

export default function PreOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [requirements, setRequirements] = useState<RequirementItem[]>(
    defaultRequirements.map((label, index) => ({
      id: `req-${index}`,
      label,
      checked: true,
    }))
  );
  const [newRequirement, setNewRequirement] = useState("");

  const handleStageChange = (value: string) => {
    const customFinalStages = [
      "OfferAndFinalization",
      "PreOnboarding",
      "Onboarding",
      "Failed",
    ];

    const isCustomFinalStage = customFinalStages.includes(value);
    const currentJobId = location.state?.jobId;

    const path = isCustomFinalStage
      ? `/job/stage/${value}`
      : `/job/${currentJobId}/${value}`;

    navigate(path, {
      state: {
        jobTitle: location.state?.jobTitle,
        jobId: currentJobId,
        from: location.pathname,
      },
    });
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([
        ...requirements,
        { id: `req-custom-${Date.now()}`, label: newRequirement.trim(), checked: true },
      ]);
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (id: string) => {
    setRequirements(requirements.filter((r) => r.id !== id));
  };

  const filteredApplicants = sampleApplicants.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canPass = (applicant: PreOnboardingApplicant) => {
    return applicant.signedDocUploaded && applicant.requirementsMet === applicant.requirementsTotal;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 mt-20">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate(location.state?.from || "/job")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Select defaultValue="PreOnboarding" onValueChange={handleStageChange}>
              <SelectTrigger className="w-64">
                <SelectValue>
                  <span className="font-bold">Pre-Onboarding</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OfferAndFinalization">
                  <span className="font-bold">For Offer And Finalization</span>
                </SelectItem>
                <SelectItem value="PreOnboarding">
                  <span className="font-bold">Pre-Onboarding</span>
                </SelectItem>
                <SelectItem value="Onboarding">
                  <span className="font-bold">Onboarding</span>
                </SelectItem>
                <SelectItem value="Failed">
                  <span className="font-bold">Failed</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Requirements Configuration */}
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Requirements Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Submission Deadline
                </label>
                <Input
                  type="date"
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                  placeholder="Select deadline"
                />
              </div>
            </div>

            <h3 className="text-sm font-medium text-gray-700 mb-3">Requirement List</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto border rounded-lg p-4">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={req.checked}
                      onChange={(e) =>
                        setRequirements(
                          requirements.map((r) =>
                            r.id === req.id ? { ...r, checked: e.target.checked } : r
                          )
                        )
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{req.label}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveRequirement(req.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Add custom requirement"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddRequirement()}
              />
              <Button variant="outline" onClick={handleAddRequirement}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Applicant Review Table */}
          <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
            <div className="p-4 border-b flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-center">ID</TableHead>
                  <TableHead className="w-48">Full Name</TableHead>
                  <TableHead className="w-48">Position</TableHead>
                  <TableHead className="w-40 text-center">Signed Offer</TableHead>
                  <TableHead className="w-40 text-center">Documents</TableHead>
                  <TableHead className="w-48 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell className="text-center">{applicant.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={applicant.avatar} />
                          <AvatarFallback>
                            {applicant.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{applicant.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{applicant.position}</TableCell>
                    <TableCell className="text-center">
                      {applicant.signedDocUploaded ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-green-700">Uploaded</span>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Not uploaded</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm">
                        {applicant.requirementsMet}/{applicant.requirementsTotal}
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(applicant.requirementsMet / applicant.requirementsTotal) * 100}%`,
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={!canPass(applicant)}
                          onClick={() => console.log("Pass", applicant.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Pass
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => console.log("Fail", applicant.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Fail
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredApplicants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No applicants found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
