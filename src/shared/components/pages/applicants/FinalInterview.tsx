"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, Search, MoreHorizontal } from "lucide-react"
import { Navbar } from "@/components/reusables/Navbar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useParams, useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"

// Sample applicant data
const applicants = [
  {
    id: "001",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/32?u=001",
    department: "Engineering",
    status: "For Initial Interview",
  },
  {
    id: "002",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/32?u=002",
    department: "Engineering",
    status: "For Final Interview",
  },
  {
    id: "003",
    name: "Mike Chen",
    avatar: "https://i.pravatar.cc/32?u=003",
    department: "Engineering",
    status: "For Initial Interview",
  },
  {
    id: "004",
    name: "Emily Rodriguez",
    avatar: "https://i.pravatar.cc/32?u=004",
    department: "Engineering",
    status: "For Final Interview",
  },
  {
    id: "005",
    name: "David Kim",
    avatar: "https://i.pravatar.cc/32?u=005",
    department: "Engineering",
    status: "For Initial Interview",
  },
  {
    id: "006",
    name: "Lisa Wang",
    avatar: "https://i.pravatar.cc/32?u=006",
    department: "Engineering",
    status: "For Final Interview",
  },
  {
    id: "007",
    name: "Alex Thompson",
    avatar: "https://i.pravatar.cc/32?u=007",
    department: "Engineering",
    status: "For Initial Interview",
  },
  {
    id: "008",
    name: "Maria Garcia",
    avatar: "https://i.pravatar.cc/32?u=008",
    department: "Engineering",
    status: "For Final Interview",
  },
]

const statusStyles = {
  active: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
  inactive: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
}

interface SidebarCandidate {
  id: string
  name: string
  title: string
  stage: number
  stageColor: "orange" | "red" | "green"
  timeAgo: string
}

// Sidebar Component
function Sidebar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const candidates: SidebarCandidate[] = [
    {
      id: "c1",
      name: "Jane Cruise",
      title: "Senior frontend developer",
      stage: 3,
      stageColor: "orange",
      timeAgo: "5d ago",
    },
    {
      id: "c2",
      name: "Green William",
      title: "UI/UX designer & developer",
      stage: 3,
      stageColor: "red",
      timeAgo: "4h ago",
    },
    {
      id: "c3",
      name: "Daniel Goldberg",
      title: "Magna lorem consectetur",
      stage: 1,
      stageColor: "green",
      timeAgo: "1 day ago",
    },
  ]

  const getStageColorClass = (color: "orange" | "red" | "green") => {
    switch (color) {
      case "orange":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "red":
        return "bg-red-100 text-red-800 border-red-200"
      case "green":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="w-full xl:w-[320px] bg-white xl:border-l border-gray-200 p-4 pt-4 space-y-4 xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto">
      {/* Calendar */}
      <div className="bg-white rounded-lg border p-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border-0 xl:scale-90 mx-auto"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Select defaultValue="stage-01">
          <SelectTrigger className="w-full text-xs">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stage-01">Stage: 01</SelectItem>
            <SelectItem value="stage-02">Stage: 02</SelectItem>
            <SelectItem value="stage-03">Stage: 03</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="today">
          <SelectTrigger className="w-full text-xs">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Candidates List */}
      <div className="space-y-2">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="flex items-start gap-2 p-2 rounded-lg border hover:bg-gray-50">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${candidate.id}`} alt={candidate.name} />
              <AvatarFallback className="text-xs">{candidate.name.split(" ").map((n) => n[0])}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-xs">{candidate.name}</p>
                  <p className="text-xs text-gray-500 mb-1">{candidate.title}</p>
                  <Badge variant="outline" className={`text-xs ${getStageColorClass(candidate.stageColor)}`}>
                    Stage {candidate.stage}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-1">{candidate.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Reschedule Interview Modal Component
function RescheduleInterviewModal({
  isOpen,
  onClose,
  applicantName,
}: { isOpen: boolean; onClose: () => void; applicantName: string }) {
  const [interviewType, setInterviewType] = useState("onsite")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Transparent gray overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Form modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Reschedule Interview</h2>
            <p className="text-gray-600">Plan, organize, and reschedule interview</p>
            <p className="text-sm text-blue-600 mt-1">Candidate: {applicantName}</p>
          </div>

          {/* Interview Date */}
          <div className="mb-6">
            <Label htmlFor="interview-date" className="text-sm font-medium text-gray-700 mb-2 block">
              Interview Date
            </Label>
            <Input id="interview-date" type="date" className="w-full" />
          </div>

          {/* Additional Information Card */}
          <Card className="mb-6">
            <CardContent className="p-4 space-y-4">
              {/* First Row: Time, Duration, Interviewer Names */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="time" className="text-sm font-medium text-gray-700 mb-1 block">
                    Time
                  </Label>
                  <Input id="time" type="time" placeholder="09:00" />
                </div>
                <div>
                  <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-1 block">
                    Duration
                  </Label>
                  <Input id="duration" placeholder="1 hour" />
                </div>
                <div>
                  <Label htmlFor="interviewers" className="text-sm font-medium text-gray-700 mb-1 block">
                    Interviewer Names
                  </Label>
                  <Input id="interviewers" placeholder="John Doe, Jane Smith" />
                </div>
              </div>

              {/* Second Row: Subject and Interview Setup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-1 block">
                    Subject
                  </Label>
                  <Input id="subject" placeholder="Frontend Developer Interview" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Interview Set-up</Label>
                  <RadioGroup value={interviewType} onValueChange={setInterviewType} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="onsite" id="onsite" />
                      <Label htmlFor="onsite" className="text-sm">
                        Onsite
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="offsite" id="offsite" />
                      <Label htmlFor="offsite" className="text-sm">
                        Offsite
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone" className="text-sm">
                        Phone
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Meeting App Dropdown */}
              {(interviewType === "offsite" || interviewType === "phone") && (
                <div>
                  <Label htmlFor="meeting-app" className="text-sm font-medium text-gray-700 mb-1 block">
                    Meeting App
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meeting app" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                      <SelectItem value="meet">Google Meet</SelectItem>
                      <SelectItem value="webex">Cisco Webex</SelectItem>
                      <SelectItem value="skype">Skype</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Meeting Link */}
              {(interviewType === "offsite" || interviewType === "phone") && (
                <div>
                  <Label htmlFor="meeting-link" className="text-sm font-medium text-gray-700 mb-1 block">
                    Meeting Link
                  </Label>
                  <Textarea
                    id="meeting-link"
                    placeholder="Paste the meeting link here..."
                    className="min-h-[80px] resize-none"
                  />
                </div>
              )}

              {/* Meeting Title/Link Name */}
              {(interviewType === "offsite" || interviewType === "phone") && (
                <div>
                  <Label htmlFor="meeting-title" className="text-sm font-medium text-gray-700 mb-1 block">
                    Meeting Title/Link Name
                  </Label>
                  <Input id="meeting-title" placeholder="Interview with [Candidate Name]" />
                </div>
              )}

              {/* Location for Onsite */}
              {interviewType === "onsite" && (
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1 block">
                    Location
                  </Label>
                  <Input id="location" placeholder="Conference Room A, 2nd Floor" />
                </div>
              )}

              {/* Additional Notes */}
              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-1 block">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information or special requirements..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Reason for Rescheduling */}
              <div>
                <Label htmlFor="reschedule-reason" className="text-sm font-medium text-gray-700 mb-1 block">
                  Reason for Rescheduling
                </Label>
                <Textarea
                  id="reschedule-reason"
                  placeholder="Please provide the reason for rescheduling this interview..."
                  className="min-h-[100px] resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle form submission here
                console.log(`Interview rescheduled for ${applicantName}!`)
                onClose()
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Confirm Reschedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function JobManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("")
  const [jobStatus, setJobStatus] = useState("active")

  

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)
  const [selectedApplicantForReschedule, setSelectedApplicantForReschedule] = useState("")

  const handleRescheduleInterview = (applicantName: string) => {
    setSelectedApplicantForReschedule(applicantName)
    setIsRescheduleOpen(true)
  }

  // Filter applicants based on search term
  const filteredApplicants = applicants.filter((applicant) =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
const formatJobTitle = (slug?: string) => {
  const titleMap: Record<string, string> = {
    leaddeveloper: "Lead Developer",
    projectmanager: "Project Manager",
    socialcontentmanager: "Social Content Manager",
    senioruiuxdesigner: "Senior UI/UX Designer",
    customersupport: "Customer Support",
    qaengineer: "QA Engineer",
    humanresourcescoordinator: "Human Resources Coordinator",
    operationsmanager: "Operations Manager",
    socialmediamanager: "Social Media Manager",
    marketingspecialist: "Marketing Specialist",
    seniorsoftwareengineer: "Senior Software Engineer",
  }
  return slug ? titleMap[slug.toLowerCase()] || slug.replace(/([a-z])([A-Z])/g, "$1 $2") : "Unknown Job"
}

  const { jobtitle } = useParams<{ jobtitle: string }>()
const resolvedJobTitle = formatJobTitle(jobtitle)

const navigate = useNavigate()

const location = useLocation()
const previousPath = location.state?.from

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 mt-20">
        <div className="flex flex-col xl:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-4">
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
    if (previousPath?.includes("/weekly")) {
      navigate(`/job/${jobtitle}/weekly`)
    } else {
      navigate(`/job/${jobtitle}`)
    }
  }}
>
  <ArrowLeft className="h-4 w-4" />
  Back
</Button>

                  <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 text-center sm:text-left">{resolvedJobTitle}</h1>

                    <Select value={jobStatus} onValueChange={setJobStatus}>
                      <SelectTrigger
                        className={`mt-10 sm:mt-0 w-auto min-w-[80px] text-xs font-medium border rounded px-2 py-0.5 ${statusStyles[jobStatus as keyof typeof statusStyles]}`}
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
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:items-center">
                  <Select
  value={selectedFilter || "finalinterview"}
  onValueChange={(value) => {
    setSelectedFilter(value)
    if (jobtitle) {
      navigate(`/job/${jobtitle}/${value}`)
    }
  }}
>

                    <SelectTrigger className="min-w-[160px] border-none shadow-none font-bold text-black text-sm">

                      <SelectValue placeholder="Shortlisted" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="font-bold" value="resumescreening">
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
                    <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search applicants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-48 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Applicants Table */}
              <div className="mt-4 rounded-md border bg-white overflow-x-auto">
                <Table className="table-fixed text-xs lg:min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center align-center w-16 border border-gray-200 py-2 px-3 text-xs lg:text-sm lg:py-3 lg:px-4">
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
                        Set
                        <br />
                        Schedule
                      </TableHead>
                      <TableHead className="border border-gray-200 py-2 px-3 w-12 lg:min-w-[80px] text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                        Status
                      </TableHead>
                      <TableHead className="text-center align-center border border-gray-200 py-2 px-3 w-20 lg:min-w-[120px] text-xs lg:text-sm lg:py-3 lg:px-4">
                        Department
                      </TableHead>
                      <TableHead className="border border-gray-200 py-2 px-3 w-24 lg:min-w-[160px] text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                        Interview Evaluation
                        <br />
                        Form
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplicants.length > 0 ? (
                      filteredApplicants.map((applicant) => (
                        <TableRow key={applicant.id} className="hover:bg-gray-50 h-16 lg:h-20">
                          <TableCell className="text-center align-center border border-gray-200 py-3 px-3 font-medium text-xs lg:text-sm align-middle">
  {applicant.id}
</TableCell>

                          <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 w-32 align-middle">
                            <div className="flex items-center justify-center gap-2 lg:gap-3">
                              <Avatar className="h-6 w-6 lg:h-8 lg:w-8 flex-shrink-0">
                                <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs lg:text-sm">
                                  {applicant.name
                                    .split(" ")
                                    .map((n) => n[0])
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
                          <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 text-center w-20 align-middle">
                            <Button
  variant="default"
  size="sm"
  className="w-full px-2 lg:px-3 bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white text-xs lg:text-sm h-9 lg:h-10 leading-tight lg:whitespace-nowrap"
  onClick={() => navigate("/ieform/")}
>
  Start
  <br />
  Interview
</Button>

                          </TableCell>
                          <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 text-center w-20 align-middle">
                            <Button
  variant="default"
  size="sm"
  className="w-full px-2 lg:px-3 bg-white text-yellow-600 border border-yellow-500 hover:bg-yellow-500 hover:text-white text-xs lg:text-sm h-9 lg:h-10 leading-tight lg:whitespace-nowrap"
  onClick={() => handleRescheduleInterview(applicant.name)}
>
  Reschedule
</Button>

                          </TableCell>
                          <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 text-center w-12 align-middle">
                            <Button
  variant="outline"
  size="sm"
  className="w-full px-1 lg:px-3 bg-white text-red-600 border border-red-500 hover:bg-red-500 hover:text-white text-xs lg:text-sm h-7 lg:h-10 lg:whitespace-nowrap"
>
  Fail
</Button>

                          </TableCell>
                          <TableCell className="text-center align-center border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 w-20 text-xs lg:text-sm align-middle">
                            <span className="break-words leading-tight lg:whitespace-nowrap">
                              {applicant.department}
                            </span>
                          </TableCell>
                          <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 text-center w-24 align-middle">
                            <Button
  variant="outline"
  size="sm"
  className="w-full px-1 lg:px-3 text-xs lg:text-sm h-7 lg:h-10 lg:whitespace-nowrap"
  onClick={() => navigate(`/job/list/applicants/${applicant.id}/IEForm`)}
>
  View
</Button>

                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
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
                <div className="text-xs lg:text-sm text-gray-600">
                  Showing {filteredApplicants.length} of {applicants.length} applicants
                  {searchTerm && ` for "${searchTerm}"`}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Stacks below on mobile/tablet, side by side on xl screens */}
          <Sidebar />
        </div>
        {/* Reschedule Interview Modal */}
        <RescheduleInterviewModal
          isOpen={isRescheduleOpen}
          onClose={() => setIsRescheduleOpen(false)}
          applicantName={selectedApplicantForReschedule}
        />
      </div>
    </>
  )
}
