"use client"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Search, Plus } from "lucide-react"
import { Navbar } from "@/components/reusables/Navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLocation } from "react-router-dom"
// Sample data for different tabs
const acceptedApplicants = [
  {
    id: "001",
    name: "John Doe",
    position: "Senior Software Engineer",
    department: "Engineering",
    avatar: "https://i.pravatar.cc/32?u=001",
  },
  {
    id: "002",
    name: "Sarah Johnson",
    position: "Frontend Developer",
    department: "Engineering",
    avatar: "https://i.pravatar.cc/32?u=002",
  },
  {
    id: "003",
    name: "Mike Chen",
    position: "UI/UX Designer",
    department: "Design",
    avatar: "https://i.pravatar.cc/32?u=003",
  },
]

const rejectedApplicants = [
  {
    id: "004",
    name: "Emily Rodriguez",
    position: "Backend Developer",
    department: "Engineering",
    avatar: "https://i.pravatar.cc/32?u=003",
  },
  {
    id: "005",
    name: "David Kim",
    position: "Product Manager",
    department: "Product",
    avatar: "https://i.pravatar.cc/32?u=004",
  },
]

const rescindedApplicants = [
  {
    id: "006",
    name: "Lisa Wang",
    position: "Data Analyst",
    department: "Analytics",
    avatar: "https://i.pravatar.cc/32?u=005",
  },
]

const positions = [
  "Senior Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Product Manager",
  "Data Analyst",
]
const departments = ["Engineering", "Design", "Product", "Analytics", "Marketing", "Sales"]

// Send Requirements Modal
function SendRequirementsModal({
  isOpen,
  onClose,
  applicantName,
}: { isOpen: boolean; onClose: () => void; applicantName: string }) {
  const [submissionDate, setSubmissionDate] = useState("")
  const [reportDate, setReportDate] = useState("")
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([])
  const [customRequirements, setCustomRequirements] = useState<string[]>([])
  const [newRequirement, setNewRequirement] = useState("")

  const defaultRequirements = [
    "Valid NBI Clearance or Police Clearance",
    "Medical Certificate",
    "Certificate of Employment",
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
  ]

  const handleRequirementChange = (requirement: string, checked: boolean) => {
    if (checked) {
      setSelectedRequirements([...selectedRequirements, requirement])
    } else {
      setSelectedRequirements(selectedRequirements.filter((r) => r !== requirement))
    }
  }

  const addCustomRequirement = () => {
    if (newRequirement.trim()) {
      setCustomRequirements([...customRequirements, newRequirement.trim()])
      setNewRequirement("")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Send Requirements</h2>
            <hr className="border-blue-600 border-t-2" />
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="submission-date" className="text-sm font-medium text-gray-700 mb-1 block">
                  Submission Date (DD/MM/YYYY)
                </Label>
                <Input
                  id="submission-date"
                  type="date"
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="report-date" className="text-sm font-medium text-gray-700 mb-1 block">
                  Report Date (DD/MM/YYYY HH:MM)
                </Label>
                <Input
                  id="report-date"
                  type="datetime-local"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Requirement List:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {defaultRequirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`req-${index}`}
                      checked={selectedRequirements.includes(requirement)}
                      onChange={(e) => handleRequirementChange(requirement, e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label htmlFor={`req-${index}`} className="text-sm text-gray-700">
                      {index + 1}. {requirement}
                    </label>
                  </div>
                ))}
                {customRequirements.map((requirement, index) => (
                  <div key={`custom-${index}`} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`custom-req-${index}`}
                      checked={selectedRequirements.includes(requirement)}
                      onChange={(e) => handleRequirementChange(requirement, e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label htmlFor={`custom-req-${index}`} className="text-sm text-gray-700">
                      {defaultRequirements.length + index + 1}. {requirement}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Add custom requirement..."
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addCustomRequirement} className="bg-blue-600 text-white hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log(`Requirements sent to ${applicantName}!`)
                onClose()
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Reconsider Modal
function ReconsiderModal({ isOpen, onClose, applicant }: { isOpen: boolean; onClose: () => void; applicant: any }) {
  const [reconsiderPosition, setReconsiderPosition] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Reconsider</h2>
            <p className="text-gray-700 mb-4">Are you sure you want to reconsider this applicant?</p>
            <hr className="border-blue-600 border-t-2" />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="position-applied" className="text-sm font-medium text-gray-700 mb-1 block">
                Position Applied
              </Label>
              <Input id="position-applied" value={applicant?.position || ""} disabled className="bg-gray-100" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="reconsider-position" className="text-sm font-medium text-gray-700 mb-1 block">
                  Reconsider to Position
                </Label>
                <Select value={reconsiderPosition} onValueChange={setReconsiderPosition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions
                      .filter((pos) => pos !== applicant?.position)
                      .map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    console.log(`Reconsidering ${applicant?.name} for the same position`)
                    onClose()
                  }}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Reconsider for the same position
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log(`Reconsidering ${applicant?.name} for ${reconsiderPosition || applicant?.position}`)
                onClose()
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Rescind Modal
function RescindModal({
  isOpen,
  onClose,
  applicantName,
}: { isOpen: boolean; onClose: () => void; applicantName: string }) {
  const [selectedOption, setSelectedOption] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Rescind Job Offer</h2>
            <p className="text-gray-700 mb-4">Are you sure you want to rescind the offer made to this applicant?</p>
          </div>

          <div className="mb-4">
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="yes"
                  name="rescind"
                  value="yes"
                  checked={selectedOption === "yes"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="yes" className="text-sm font-medium text-gray-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="no"
                  name="rescind"
                  value="no"
                  checked={selectedOption === "no"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="no" className="text-sm font-medium text-gray-700">
                  No
                </label>
              </div>
            </div>
          </div>

          <>
            <hr className="border-blue-600 border-t-2 mb-6" />

            <div className="space-y-4">
              <div>
                <Label htmlFor="rescind-reason" className="text-sm font-medium text-gray-700 mb-1 block">
                  Reason for rescinding the offer
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason for rescinding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget-constraints">Budget constraints</SelectItem>
                    <SelectItem value="position-eliminated">Position eliminated</SelectItem>
                    <SelectItem value="hiring-freeze">Hiring freeze</SelectItem>
                    <SelectItem value="better-candidate">Found a better candidate</SelectItem>
                    <SelectItem value="candidate-issues">Issues with candidate background</SelectItem>
                    <SelectItem value="business-changes">Business requirements changed</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rescind-remarks" className="text-sm font-medium text-gray-700 mb-1 block">
                  Remarks
                </Label>
                <textarea
                  id="rescind-remarks"
                  placeholder="Add your remarks here..."
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log(`Job offer rescinded for ${applicantName}!`)
                onClose()
              }}
              disabled={selectedOption === "no"}
              className={`${
                selectedOption === "no"
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OfferAndFinalization() {
  const [activeTab, setActiveTab] = useState("accepted")
  const [searchTerms, setSearchTerms] = useState({
    accepted: "",
    rejected: "",
    rescinded: "",
  })
  const [positionFilters, setPositionFilters] = useState({
    accepted: "",
    rejected: "",
    rescinded: "",
  })
  const [departmentFilters, setDepartmentFilters] = useState({
    accepted: "",
    rejected: "",
    rescinded: "",
  })

  // Modal states
  const [isRequirementsModalOpen, setIsRequirementsModalOpen] = useState(false)
  const [isReconsiderModalOpen, setIsReconsiderModalOpen] = useState(false)
  const [isRescindModalOpen, setIsRescindModalOpen] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null)

  const navigate = useNavigate()

 const handleStageChange = (value: string) => {
const customFinalStages = [
  "OfferAndFinalization",
  "Onboarding",
  "Warm",
  "Failed",
];


  const isCustomFinalStage = customFinalStages.includes(value);

  const routeSegment = slugify(value);

  const path = isCustomFinalStage
    ? `/job/stage/${routeSegment}`
    : `/job/${routeSegment}`;

  navigate(path, {
    state: {
      jobTitle: location.state?.jobTitle,
      jobData: location.state?.jobData,
      from: location.pathname,
    },
  });
};



  // Filter functions
  const filterApplicants = (applicants: any[], tab: string) => {
    return applicants.filter((applicant) => {
      const matchesSearch = applicant.name
        .toLowerCase()
        .includes(searchTerms[tab as keyof typeof searchTerms].toLowerCase())
      const matchesPosition =
        positionFilters[tab as keyof typeof positionFilters] === "all" ||
        positionFilters[tab as keyof typeof positionFilters] === "" ||
        applicant.position === positionFilters[tab as keyof typeof positionFilters]
      const matchesDepartment =
        departmentFilters[tab as keyof typeof departmentFilters] === "all" ||
        departmentFilters[tab as keyof typeof departmentFilters] === "" ||
        applicant.department === departmentFilters[tab as keyof typeof departmentFilters]
      return matchesSearch && matchesPosition && matchesDepartment
    })
  }

  const clearAllFilters = (tab: string) => {
    setSearchTerms((prev) => ({ ...prev, [tab]: "" }))
    setPositionFilters((prev) => ({ ...prev, [tab]: "" }))
    setDepartmentFilters((prev) => ({ ...prev, [tab]: "" }))
  }

  const filteredAccepted = useMemo(
    () => filterApplicants(acceptedApplicants, "accepted"),
    [searchTerms.accepted, positionFilters.accepted, departmentFilters.accepted],
  )
  const filteredRejected = useMemo(
    () => filterApplicants(rejectedApplicants, "rejected"),
    [searchTerms.rejected, positionFilters.rejected, departmentFilters.rejected],
  )
  const filteredRescinded = useMemo(
    () => filterApplicants(rescindedApplicants, "rescinded"),
    [searchTerms.rescinded, positionFilters.rescinded, departmentFilters.rescinded],
  )

  const handleSendRequirements = (applicant: any) => {
    setSelectedApplicant(applicant)
    setIsRequirementsModalOpen(true)
  }

  const handleReconsider = (applicant: any) => {
    setSelectedApplicant(applicant)
    setIsReconsiderModalOpen(true)
  }

  const handleRescind = (applicant: any) => {
    setSelectedApplicant(applicant)
    setIsRescindModalOpen(true)
  }

  const renderSearchAndFilters = (tab: string) => (
    <div className="flex flex-col gap-4 mb-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search applicants..."
          value={searchTerms[tab as keyof typeof searchTerms]}
          onChange={(e) => setSearchTerms((prev) => ({ ...prev, [tab]: e.target.value }))}
          className="pl-8"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Select
          value={positionFilters[tab as keyof typeof positionFilters]}
          onValueChange={(value) => setPositionFilters((prev) => ({ ...prev, [tab]: value }))}
        >
          <SelectTrigger className="w-64 sm:w-48">
            <SelectValue placeholder="Filter by Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {positions.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={departmentFilters[tab as keyof typeof departmentFilters]}
          onValueChange={(value) => setDepartmentFilters((prev) => ({ ...prev, [tab]: value }))}
        >
          <SelectTrigger className="w-64 sm:w-48">
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => clearAllFilters(tab)}
          className="w-64 sm:w-auto bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  )

  
const location = useLocation()
const jobTitleFromState = location.state?.jobTitle
const from = location.state?.from

const slugify = (str: string) =>
  str.replace(/\s+/g, "").replace(/[^\w]+/g, "");


const backPath = from?.includes("/weekly")
  ? `/job/${slugify(jobTitleFromState)}\/weekly`
  : `/job/${slugify(jobTitleFromState)}`



  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 mt-20">
        <div className="mx-auto max-w-7xl space-y-4">
          {/* Header Section */}
          <div className="flex items-center gap-4">
            <Button
  variant="outline"
  size="sm"
  className="flex items-center gap-2"
  onClick={() => navigate(backPath)}
>
  <ArrowLeft className="h-4 w-4" />
  Back
</Button>

            <Select defaultValue="OfferAndFinalization" onValueChange={handleStageChange}>
              <SelectTrigger className="w-64">
                <SelectValue>
                  <span className="font-bold">For Offer And Finalization</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OfferAndFinalization">
                  <span className="font-bold">For Offer And Finalization</span>
                </SelectItem>
                <SelectItem value="Onboarding">
                  <span className="font-bold">Onboarding</span>
                </SelectItem>
                <SelectItem value="Warm">
                  <span className="font-bold">Warm</span>
                </SelectItem>
                <SelectItem value="Failed">
                  <span className="font-bold">Failed</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="rescinded">Rescinded</TabsTrigger>
            </TabsList>

            {/* Accepted Tab */}
            <TabsContent value="accepted" className="space-y-4">
              {renderSearchAndFilters("accepted")}
              <div className="rounded-md border bg-white overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-white to-transparent w-8 h-full pointer-events-none z-10 opacity-50"></div>
                <Table className="w-full table-fixed min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-30 border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        ID
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Full Name
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Position Applying For
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Requirements
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Rescind
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Department
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccepted.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          {applicant.id}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <Avatar className="h-6 w-6 lg:h-8 lg:w-8 flex-shrink-0">
                              <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs lg:text-sm">
                                {applicant.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span
                              className="font-medium text-xs lg:text-sm break-words leading-tight lg:whitespace-nowrap"
                              title={applicant.name}
                            >
                              {applicant.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          {applicant.position}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 min-h-[80px] align-middle">
                          <div className="flex justify-center">
                            <Button
                              onClick={() => handleSendRequirements(applicant)}
                              className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded text-xs px-2 py-1 whitespace-normal leading-tight"
                            >
                              Send Requirement
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 min-h-[80px] align-middle">
                          <div className="flex justify-center">
                            <Button
                              onClick={() => handleRescind(applicant)}
                              className="bg-white text-yellow-600 border border-yellow-600 hover:bg-yellow-600 hover:text-white rounded text-xs px-2 py-1 whitespace-normal leading-tight"
                            >
                              Rescind
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          {applicant.department}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Rejected Tab */}
            <TabsContent value="rejected" className="space-y-4">
              {renderSearchAndFilters("rejected")}
              <div className="rounded-md border bg-white overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-white to-transparent w-8 h-full pointer-events-none z-10 opacity-50"></div>
                <Table className="w-full table-fixed min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        ID Number
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Full Name
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Position Applying For
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Department
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Reconsider
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Job Offer
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRejected.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          {applicant.id}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          {applicant.name}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          {applicant.position}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          {applicant.department}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 min-h-[80px] align-middle">
                          <div className="flex justify-center">
                            <Button
                              onClick={() => handleReconsider(applicant)}
                              className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded text-xs px-2 py-1 whitespace-normal leading-tight"
                            >
                              Reconsider
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          <a
                            href={`/job-offers/Job_Offer_${applicant.name.split(" ").pop()}.pdf`}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Job_Offer_{applicant.name.split(" ").pop()}.pdf
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Rescinded Tab */}
            <TabsContent value="rescinded" className="space-y-4">
              {renderSearchAndFilters("rescinded")}
              <div className="rounded-md border bg-white overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-white to-transparent w-8 h-full pointer-events-none z-10 opacity-50"></div>
                <Table className="w-full table-fixed min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        ID Number
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Full Name
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Position Applying For
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Department
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Reconsider
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle">
                        Job Offer
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRescinded.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          {applicant.id}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          {applicant.name}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          {applicant.position}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          {applicant.department}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 min-h-[80px] align-middle">
                          <div className="flex justify-center">
                            <Button
                              onClick={() => handleReconsider(applicant)}
                              className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded text-xs px-2 py-1 whitespace-normal leading-tight"
                            >
                              Reconsider
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                          <a
                            href={`/job-offers/Job_Offer_${applicant.name.split(" ").pop()}.pdf`}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Job_Offer_{applicant.name.split(" ").pop()}.pdf
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          {/* Modals */}
          <SendRequirementsModal
            isOpen={isRequirementsModalOpen}
            onClose={() => setIsRequirementsModalOpen(false)}
            applicantName={selectedApplicant?.name || ""}
          />

          <ReconsiderModal
            isOpen={isReconsiderModalOpen}
            onClose={() => setIsReconsiderModalOpen(false)}
            applicant={selectedApplicant}
          />

          <RescindModal
            isOpen={isRescindModalOpen}
            onClose={() => setIsRescindModalOpen(false)}
            applicantName={selectedApplicant?.name || ""}
          />
        </div>
      </div>
    </>
  )
}
