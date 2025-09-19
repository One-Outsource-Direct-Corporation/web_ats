"use client"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Search, Eye, Briefcase, Calendar, MapPin, Download } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/reusables/Navbar"
import { useLocation } from "react-router-dom"
// Sample data for onboarding applicants
const onboardingApplicants = [
  {
    id: "001",
    name: "John Doe",
    position: "Senior Software Engineer",
    progressScore: 7,
    startDate: "2024-01-15",
    deadline: "2024-02-15",
    status: "incomplete",
    avatar: "https://i.pravatar.cc/32?u=001",
    address: "New York, USA",
  },
  {
    id: "002",
    name: "Sarah Johnson",
    position: "Frontend Developer",
    progressScore: 10,
    startDate: "2024-01-10",
    deadline: "2024-02-10",
    status: "complete",
    avatar: "https://i.pravatar.cc/32?u=002",
    address: "Los Angeles, USA",
  },
  {
    id: "003",
    name: "Mike Chen",
    position: "UI/UX Designer",
    progressScore: 10,
    startDate: "2024-01-20",
    deadline: "2024-02-20",
    status: "incomplete",
    avatar: "https://i.pravatar.cc/32?u=003",
    address: "San Francisco, USA",
  },
  {
    id: "004",
    name: "Emily Rodriguez",
    position: "Backend Developer",
    progressScore: 10,
    startDate: "2024-01-05",
    deadline: "2024-02-05",
    status: "complete",
    avatar: "https://i.pravatar.cc/32?u=004",
    address: "Chicago, USA",
  },
  {
    id: "005",
    name: "David Kim",
    position: "Product Manager",
    progressScore: 6,
    startDate: "2024-01-25",
    deadline: "2024-02-25",
    status: "incomplete",
    avatar: "https://i.pravatar.cc/32?u=005",
    address: "Seattle, USA",
  },
]

const documents = [
  "Resume",
  "NBI Clearance",
  "Medical Certificate",
  "Certificate of Employment (COE)",
  "Income Tax Return (ITR 2316)",
  "Barangay Clearance",
  "Photocopy of Dependents Birth Certificate",
  "Photocopy of Marriage Contract",
  "Photocopy of Birth Certificate",
  "Photocopy of BIR ID / TIN Card",
]

const positions = [
  "Senior Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Product Manager",
]

export default function Onboarding() {
  const [searchTerm, setSearchTerm] = useState("")
  const [positionFilter, setPositionFilter] = useState("")
  const [activeTab, setActiveTab] = useState("incomplete")
  const [viewingDocuments, setViewingDocuments] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null)
  const [selectedDocument, setSelectedDocument] = useState("Resume")

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



  // Filter function
  const filteredApplicants = useMemo(() => {
    return onboardingApplicants.filter((applicant) => {
      const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPosition = positionFilter === "all" || positionFilter === "" || applicant.position === positionFilter
      const matchesStatus =
        activeTab === "incomplete" ? applicant.status === "incomplete" : applicant.status === "complete"
      return matchesSearch && matchesPosition && matchesStatus
    })
  }, [searchTerm, positionFilter, activeTab])

  const clearAllFilters = () => {
    setSearchTerm("")
    setPositionFilter("")
  }

  const handleMarkComplete = (applicant: any) => {
    console.log(`Marking ${applicant.name} as complete`)
  }

  const handleViewDocuments = (applicant: any) => {
    setSelectedApplicant(applicant)
    setViewingDocuments(true)
  }

  const handleBackToTable = () => {
    setViewingDocuments(false)
    setSelectedApplicant(null)
  }

  if (viewingDocuments && selectedApplicant) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 p-4 mt-20">
          <div className="mx-auto max-w-7xl space-y-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleBackToTable}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search documents..." className="pl-8" />
            </div>

            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Submitted Documents</h2>
              <div className="flex-1 h-px bg-blue-500"></div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedApplicant.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedApplicant.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold">{selectedApplicant.name}</h3>
                      <Button variant="link" className="text-blue-600 p-0">
                        View full profile
                      </Button>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {selectedApplicant.position}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {selectedApplicant.startDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedApplicant.address}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium self-start sm:self-auto">
                  Completed Requirements
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:flex-1 bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">{selectedDocument} Preview</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">{selectedDocument}</p>
                    <p className="text-sm">Document preview for {selectedApplicant.name}</p>
                    <p className="text-xs mt-2">Generated based on applicant profile</p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-80 space-y-4">
                <h3 className="text-lg font-semibold">Documents List</h3>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDocument === doc ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <span className="text-sm font-medium">{doc}</span>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  Download All Documents
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-7xl space-y-4 mt-20">
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

            <Select defaultValue="Onboarding" onValueChange={handleStageChange}>
              <SelectTrigger className="w-64">
                <SelectValue>
                  <span className="font-bold">Onboarding</span>
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
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-2 max-w-md w-full sm:w-auto">
                <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
                <TabsTrigger value="complete">Complete</TabsTrigger>
              </TabsList>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 mb-4 mt-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Select value={positionFilter} onValueChange={setPositionFilter}>
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

                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="w-64 sm:w-auto bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>

            <TabsContent value="incomplete" className="space-y-4">
              <div className="rounded-md border bg-white overflow-x-auto">
                <Table className="w-full table-fixed min-w-[1200px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[100px]">
                        ID
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[180px]">
                        Full Name
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[180px]">
                        Applied Position
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[150px]">
                        Start Date
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[200px]">
                        Status of Requirement
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[150px]">
                        Deadline
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[150px]">
                        Mark as Complete
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs text-center">
                          {applicant.id}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {applicant.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{applicant.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs text-center">
                          {applicant.position}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs text-center">
                          <div className="space-y-1">
                            <div className="font-bold text-lg">{applicant.progressScore}/10</div>
                            <div className="text-gray-600">{applicant.startDate}</div>
                          </div>
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2">
                          <div className="px-2">
                            <Progress value={applicant.progressScore * 10} className="w-full" />
                          </div>
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs text-center">
                          {applicant.deadline}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-center">
                          <Button
                            onClick={() => handleMarkComplete(applicant)}
                            disabled={applicant.progressScore < 10}
                            className={`text-xs px-3 py-1 rounded ${
                              applicant.progressScore === 10
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Complete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="complete" className="space-y-4">
              <div className="rounded-md border bg-white overflow-x-auto">
                <Table className="w-full table-fixed min-w-[1200px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[100px]">
                        ID
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[180px]">
                        Full Name
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[180px]">
                        Applied Position
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[150px]">
                        Start Date
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[200px]">
                        Status of Requirement
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[150px]">
                        Deadline
                      </TableHead>
                      <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center w-[200px]">
                        View Submitted Documents
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs text-center">
                          {applicant.id}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {applicant.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{applicant.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs text-center">
                          {applicant.position}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs text-center">
                          <div className="space-y-1">
                            <div className="font-bold text-lg">10/10</div>
                            <div className="text-gray-600">{applicant.startDate}</div>
                          </div>
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2">
                          <div className="space-y-2">
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs text-center font-medium">
                              Complete
                            </div>
                            <Progress value={100} className="w-full" />
                          </div>
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-xs text-center">
                          {applicant.deadline}
                        </TableCell>
                        <TableCell className="border border-gray-200 py-3 px-2 text-center">
                          <Button
                            onClick={() => handleViewDocuments(applicant)}
                            variant="link"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                          >
                            <Eye className="h-4 w-4" />
                            Submitted Documents
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          {/* No results message */}
          {filteredApplicants.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No {activeTab} applicants found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
