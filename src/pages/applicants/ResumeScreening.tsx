"use client"

import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Search } from "lucide-react"
import { Navbar } from "@/reusables/Navbar"
import { useLocation, useParams } from "react-router-dom"

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

export default function ResumeScreening() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("resume-screening")
  const [jobStatus, setJobStatus] = useState("active")
  const navigate = useNavigate()
  const location = useLocation()
  const { jobtitle} = useParams<{ jobtitle: string;}>()
  const state = location.state as { jobTitle?: string; stageName?: string } | null

  // Filter applicants based on search term
  const filteredApplicants = applicants.filter((applicant) =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatJobTitle = (slug?: string) => {
  const titleMap: Record<string, string> = {
    projectmanager: "Project Manager",
    socialcontentmanager: "Social Content Manager",
    senioruiuxdesigner: "Senior UI/UX Designer",
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


  const resolvedJobTitle = state?.jobTitle || formatJobTitle(jobtitle)


  


  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 p-6 mt-20">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          {/* Back Button and Job Title */}
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-4">
  <Button
  variant="outline"
  size="sm"
  className="flex items-center gap-2"
  onClick={() => navigate(`/applicants/job/${jobtitle}`)}
>
  <ArrowLeft className="h-4 w-4" />
  Back
</Button>

  <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-3">
    <h1 className="text-2xl font-bold">{resolvedJobTitle}</h1>

    <Select value={jobStatus} onValueChange={setJobStatus}>
  <SelectTrigger className={`w-auto min-w-[80px] px-3 py-1 rounded text-sm font-medium border ${statusStyles[jobStatus as keyof typeof statusStyles]} mt-5 sm:mt-0`}>
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
          <div className="flex flex-col items-center text-center gap-2 text-sm text-gray-600 sm:flex-row sm:items-center sm:text-left sm:gap-6">
  <div className="flex items-center gap-2">
    <span className="font-medium">Employment Type:</span>
    <span>Full Time</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="font-medium">Start Date:</span>
    <span>January 15, 2024</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="font-medium">Work Mode:</span>
    <span>Onsite</span>
  </div>
</div>



          {/* Filter and Search */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
  <Select 
  value={selectedFilter || "resumescreening"}
  onValueChange={(value) => {
    setSelectedFilter(value)
    if (jobtitle) {
      navigate(`/applicants/job/${jobtitle}/${value}`)
    }
  }}
>

                    <SelectTrigger className="w-40 border-none shadow-none font-bold text-black text-sm">
                      <SelectValue className="font-bold text-black" placeholder="resumescreening" />
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
                      <SelectItem value="offerfinalization" className="font-bold">
                        For Offer and Finalization
                      </SelectItem>
                      <SelectItem value="onboarding" className="font-bold">
                        Onboarding
                      </SelectItem>
                      <SelectItem value="warm" className="font-bold">
                        Warm
                      </SelectItem>
                      <SelectItem value="failed" className="font-bold">
                        Failed
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
  <Table className="min-w-full w-max text-sm text-left table-auto">
    <TableHeader>
      <TableRow>
        <TableHead className="border border-gray-200 py-4 px-6 w-24">ID Number</TableHead>
        <TableHead className="border border-gray-200 py-4 px-6 min-w-[220px]">Full Name</TableHead>
        <TableHead className="border border-gray-200 py-4 px-6 w-20 text-center">Pass</TableHead>
        <TableHead className="border border-gray-200 py-4 px-6 w-20 text-center">Fail</TableHead>
        <TableHead className="border border-gray-200 py-4 px-6 min-w-[150px]">Department</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {filteredApplicants.length > 0 ? (
        filteredApplicants.map((applicant) => (
          <TableRow key={applicant.id} className="hover:bg-gray-50">
            <TableCell className="border border-gray-200 py-4 px-6 font-medium whitespace-nowrap">
              {applicant.id}
            </TableCell>
            <TableCell className="border border-gray-200 py-4 px-6 min-w-[220px] whitespace-nowrap">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={applicant.avatar} />
                  <AvatarFallback>
                    {applicant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{applicant.name}</span>
              </div>
            </TableCell>
            <TableCell className="border border-gray-200 py-4 px-6 text-center w-20">
  <Button
    variant="success"
    size="sm"
    className="w-full px-2"
    onClick={() => navigate(`/applicants/job/${jobtitle}/phonecallinterview`)}

  >
    Pass
  </Button>
</TableCell>

            <TableCell className="border border-gray-200 py-4 px-6 text-center w-20">
              <Button variant="danger" size="sm" className="w-full px-2">
                Fail
              </Button>
            </TableCell>
            <TableCell className="border border-gray-200 py-4 px-6 min-w-[150px] whitespace-nowrap">
              {applicant.department}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={5} className="border border-gray-200 p-8 text-center text-gray-500">
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
