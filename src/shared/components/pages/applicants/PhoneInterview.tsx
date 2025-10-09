// PhoneInterview.tsx - Further refined header alignment for margin consistency

"use client"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Search } from "lucide-react"
import { Navbar } from "@/components/reusables/Navbar"
import { useLocation } from "react-router-dom";

// Sample applicant data
const applicants = [
  {
    id: "001",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/32?u=001",
    department: "Engineering",
  },
  {
    id: "002",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/32?u=002",
    department: "Engineering",
  },
  {
    id: "003",
    name: "Mike Chen",
    avatar: "https://i.pravatar.cc/32?u=003",
    department: "Engineering",
  },
  {
    id: "004",
    name: "Emily Rodriguez",
    avatar: "https://i.pravatar.cc/32?u=004",
    department: "Engineering",
  },
  {
    id: "005",
    name: "David Kim",
    avatar: "https://i.pravatar.cc/32?u=005",
    department: "Engineering",
  },
  {
    id: "006",
    name: "Lisa Wang",
    avatar: "https://i.pravatar.cc/32?u=006",
    department: "Engineering",
  },
  {
    id: "007",
    name: "Alex Thompson",
    avatar: "https://i.pravatar.cc/32?u=007",
    department: "Engineering",
  },
  {
    id: "008",
    name: "Maria Garcia",
    avatar: "https://i.pravatar.cc/32?u=008",
    department: "Engineering",
  },
]

const statusStyles = {
  active: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
  inactive: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
}

export default function PhoneInterview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("phonecallinterview")
  const [jobStatus, setJobStatus] = useState("active")
  const navigate = useNavigate()

  const { jobtitle } = useParams<{ jobtitle: string }>()

  // Filter applicants based on search term
  const filteredApplicants = applicants.filter((applicant) =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
    }
    return slug ? titleMap[slug.toLowerCase()] || slug.replace(/([a-z])([A-Z])/g, "$1 $2") : "Unknown Job"
  }

  const location = useLocation()
  const { jobtitle: jobTitleParam } = useParams<{ jobtitle: string }>()
  const jobTitleFromState = location.state?.jobTitle

  const rawJobTitle = jobTitleParam || jobTitleFromState
  const resolvedJobTitle = formatJobTitle(rawJobTitle)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 mt-20">
        <div className="mx-auto max-w-none space-y-4">
          {/* Header Section - Identical to ResumeScreening.tsx */}
          <div className="space-y-3">
            {/* Back Button and Job Title */}
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  const from = location.state?.from
                  if (from?.includes("/weekly")) {
                    navigate(from)
                  } else {
                    navigate(`/job/${jobtitle}`)
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-3">
                <h1 className="text-2xl font-bold">{resolvedJobTitle}</h1>

                <Select value={jobStatus} onValueChange={setJobStatus}>
                  <SelectTrigger
                    className={`w-auto min-w-[80px] px-3 py-1 rounded text-sm font-medium border ${statusStyles[jobStatus as keyof typeof statusStyles]} mt-5 sm:mt-0`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job Details */}
            <div className="flex flex-col items-center text-center gap-2 text-xs text-gray-600 sm:flex-row sm:items-center sm:text-left sm:gap-4">
              <div className="flex items-center gap-1">
                <span className="font-medium">Employment Type:</span>
                <span>Full Time</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Start Date:</span>
                <span>January 15, 2024</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Work Mode:</span>
                <span>Onsite</span>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
              <Select
                value={selectedFilter || "phonecallinterview"}
                onValueChange={(value) => {
                  setSelectedFilter(value)
                  if (jobtitle) {
                    navigate(`/job/${jobtitle}/${value}`)
                  }
                }}
              >
                <SelectTrigger className="min-w-[160px] border-none shadow-none font-bold text-black text-sm">
                  <SelectValue className="font-bold text-black" placeholder="phonecallinterview" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="font-bold text-black" value="resumescreening">
                    Resume Screening
                  </SelectItem>
                  <SelectItem value="phonecallinterview" className="font-bold">
                    Phone Call Interview
                  </SelectItem>
                  <SelectItem value="shortlisted" className="font-bold">
                    Shortlisted
                  </SelectItem>
                  <SelectItem value="initialinterview" className="font-bold">
                    Initial Interview
                  </SelectItem>
                  <SelectItem value="assessments" className="font-bold">
                    Assessments
                  </SelectItem>
                  <SelectItem value="finalinterview" className="font-bold">
                    Final Interview
                  </SelectItem>
                  <SelectItem value="forjoboffer" className="font-bold">
                    For Job Offer
                  </SelectItem>
                </SelectContent>
              </Select>

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

          {/* Applicants Table */}
          <div className="mt-6 overflow-x-auto rounded-md border bg-white">
            <Table className="table-fixed text-xs min-w-max">

              <TableHeader>
                <TableRow>
                  <TableHead className="w-6 text-center align-center border-gray-200 py-2 px-3 text-xs lg:text-sm lg:py-3 lg:px-4">
  ID
</TableHead>

                  <TableHead className="text-center align-center border border-gray-200 py-2 px-3 w-32 lg:min-w-[200px] text-xs lg:text-sm lg:py-3 lg:px-4">
                    Full Name
                  </TableHead>
                  <TableHead className="border border-gray-200 py-2 px-3 w-20 lg:min-w-[120px] text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                    Set
                    <br />
                    Interview
                  </TableHead>
                  <TableHead className="border border-gray-200 py-2 px-3 w-20 lg:min-w-[120px] text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                    Fail
                  </TableHead>
                  <TableHead className="text-center align-center border border-gray-200 py-2 px-3 w-20 lg:min-w-[120px] text-xs lg:text-sm lg:py-3 lg:px-4">
                    Department
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.length > 0 ? (
                  filteredApplicants.map((applicant) => (
                    <TableRow key={applicant.id} className="hover:bg-gray-50 h-16 lg:h-20">
                      <TableCell className="text-center align-center border-gray-200 py-3 px-3 font-medium text-xs lg:text-sm align-middle">
  {applicant.id}
</TableCell>

                      <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 w-32 align-middle">
                        <div className="flex items-center justify-center gap-2 lg:gap-3">
                          <Avatar className="h-6 w-6 lg:h-8 lg:w-8 flex-shrink-0">
                            <AvatarImage src={applicant.avatar} />
                            <AvatarFallback className="text-xs lg:text-sm">
                              {applicant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-xs lg:text-sm break-words leading-tight lg:whitespace-nowrap">
                            {applicant.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 text-center w-20 align-middle">
                        <Button
                          size="sm"
                          className="border-1 w-full px-2 lg:px-3 h-7 lg:h-8 text-xs lg:text-sm text-blue-600 border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition"
                          onClick={() => navigate("/ieform/")}
                        >
                          Start interview
                        </Button>
                      </TableCell>
                      <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 text-center w-20 align-middle">
                        <Button
                          size="sm"
                          className="border-1 w-full px-2 lg:px-3 h-7 lg:h-8 text-xs lg:text-sm text-red-600 border-red-600 bg-white hover:bg-red-600 hover:text-white transition"
                        >
                          Fail
                        </Button>
                      </TableCell>
                      <TableCell className="text-center align-center border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 w-20 text-xs lg:text-sm align-middle">
                        <span className="break-words leading-tight lg:whitespace-nowrap">
                          {applicant.department}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="border border-gray-200 p-6 lg:p-8 text-center text-gray-500 text-xs lg:text-sm"
                    >
                      No applicants found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Results Summary */}
          {searchTerm && (
            <div className="text-sm text-gray-600">
              Showing {filteredApplicants.length} of {applicants.length} applicants
              {searchTerm && ` for "${searchTerm}"`}
            </div>
          )}
        </div>
      </div>
    </>
  )
}