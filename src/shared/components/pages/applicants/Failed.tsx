"use client"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Search } from "lucide-react"
import { Navbar } from "@/components/reusables/Navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLocation } from "react-router-dom"
// Sample data for failed applicants
const failedApplicants = [
  {
    id: "001",
    name: "John Doe",
    position: "Senior Software Engineer",
    remarks: "Declined the Job Offer",
    stageFailed: "Third Stage: For Job Offer",
    avatar: "https://i.pravatar.cc/32?u=001",
  },
  {
    id: "002",
    name: "Sarah Johnson",
    position: "Frontend Developer",
    remarks: "Did not pass the final interview",
    stageFailed: "Second Stage: Final Interview",
    avatar: "https://i.pravatar.cc/32?u=002",
  },
  {
    id: "003",
    name: "Mike Chen",
    position: "UI/UX Designer",
    remarks: "Failed technical assessment",
    stageFailed: "Second Stage: Assessment",
    avatar: "https://i.pravatar.cc/32?u=003",
  },
  {
    id: "004",
    name: "Emily Rodriguez",
    position: "Backend Developer",
    remarks: "Did not respond to phone call interview",
    stageFailed: "First Stage: Phone Call Interview",
    avatar: "https://i.pravatar.cc/32?u=004",
  },
  {
    id: "005",
    name: "David Kim",
    position: "Product Manager",
    remarks: "Insufficient experience for the role",
    stageFailed: "First Stage: Resume Screening",
    avatar: "https://i.pravatar.cc/32?u=005",
  },
  {
    id: "006",
    name: "Lisa Wang",
    position: "Data Analyst",
    remarks: "Withdrew application during process",
    stageFailed: "Second Stage: Initial Interview",
    avatar: "https://i.pravatar.cc/32?u=006",
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

const stages = [
  "First Stage: Resume Screening",
  "First Stage: Phone Call Interview",
  "First Stage: Shortlisted",
  "Second Stage: Initial Interview",
  "Second Stage: Assessment",
  "Second Stage: Final Interview",
  "Third Stage: For Job Offer",
  "Third Stage: Job Offer & Finalization",
  "Third Stage: Onboarding",
]

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

export default function Failed() {
  const [searchTerm, setSearchTerm] = useState("")
  const [positionFilter, setPositionFilter] = useState("")
  const [stageFilter, setStageFilter] = useState("")

  // Modal states
  const [isReconsiderModalOpen, setIsReconsiderModalOpen] = useState(false)
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



  // Filter function
  const filteredApplicants = useMemo(() => {
    return failedApplicants.filter((applicant) => {
      const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPosition = positionFilter === "all" || positionFilter === "" || applicant.position === positionFilter
      const matchesStage = stageFilter === "all" || stageFilter === "" || applicant.stageFailed === stageFilter
      return matchesSearch && matchesPosition && matchesStage
    })
  }, [searchTerm, positionFilter, stageFilter])

  const clearAllFilters = () => {
    setSearchTerm("")
    setPositionFilter("")
    setStageFilter("")
  }

  const handleReconsider = (applicant: any) => {
    setSelectedApplicant(applicant)
    setIsReconsiderModalOpen(true)
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



            <Select defaultValue="Failed" onValueChange={handleStageChange}>
              <SelectTrigger className="w-64">
                <SelectValue>
                  <span className="font-bold">Failed</span>
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

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 mb-4">
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

              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-64 sm:w-48">
                  <SelectValue placeholder="Filter by Stage Failed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
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

          {/* Table */}
          <div className="rounded-md border bg-white overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-white to-transparent w-8 h-full pointer-events-none z-10 opacity-50"></div>
            <Table className="w-full table-fixed min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle w-[100px]">
                    ID
                  </TableHead>
                  <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle w-[180px]">
                    Full Name
                  </TableHead>
                  <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle w-[180px]">
                    Applied Position
                  </TableHead>
                  <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle w-[120px]">
                    Reconsider
                  </TableHead>
                  <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle w-[200px]">
                    Remarks
                  </TableHead>
                  <TableHead className="border border-gray-200 py-4 px-2 text-xs font-medium text-center break-words whitespace-normal leading-tight min-h-[80px] align-middle w-[220px]">
                    Stage Failed
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant) => (
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
                          onClick={() => handleReconsider(applicant)}
                          className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded text-xs px-2 py-1 whitespace-normal leading-tight"
                        >
                          Reconsider
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                      {applicant.remarks}
                    </TableCell>
                    <TableCell className="border border-gray-200 py-3 px-2 text-xs break-words min-h-[80px] align-middle text-center">
                      {applicant.stageFailed}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* No results message */}
          {filteredApplicants.length === 0 && (
            <div className="text-center py-8 text-gray-500">No failed applicants found matching your criteria.</div>
          )}

          {/* Reconsider Modal */}
          <ReconsiderModal
            isOpen={isReconsiderModalOpen}
            onClose={() => setIsReconsiderModalOpen(false)}
            applicant={selectedApplicant}
          />
        </div>
      </div>
    </>
  )
}
