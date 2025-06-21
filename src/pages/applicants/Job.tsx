"use client"

import { Navbar } from "@/reusables/Navbar"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { ChevronLeft, CalendarDays, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useEffect, useState } from "react"

const jobData = [
  {
    job: "Project Manager",
    date: "Jun 01, 2024",
    candidates: 10,
    vacancies: 2,
    status: "Published",
    department: "CI",
    type: "Full time",
  },
  {
    job: "Social Content Manager",
    date: "Jun 01, 2024",
    candidates: 5,
    vacancies: 1,
    status: "Published",
    department: "Marketing",
    type: "Full time",
  },
  {
    job: "Senior UI UX Designer",
    date: "Jul 29, 2024",
    candidates: 12,
    vacancies: 3,
    status: "Published",
    department: "CI",
    type: "Full time",
  },
  {
    job: "Lead Developer",
    date: "Dec 24, 2022",
    candidates: 12,
    vacancies: 4,
    status: "Pending",
    department: "CI",
    type: "Full time",
  },
  {
    job: "Customer Support",
    date: "Jul 22, 2023",
    candidates: 21,
    vacancies: 5,
    status: "Published",
    department: "CI",
    type: "Full time",
  },
  {
    job: "QA Engineer",
    date: "Jan 26, 2022",
    candidates: 18,
    vacancies: 1,
    status: "Closed",
    department: "CI",
    type: "Full time",
  },
  {
    job: "Human Resources Coordinator",
    date: "Apr 21, 2023",
    candidates: 5,
    vacancies: 1,
    status: "Closed",
    department: "HR",
    type: "Full time",
  },
  {
    job: "Operations Manager",
    date: "Feb 02, 2020",
    candidates: 10,
    vacancies: 1,
    status: "Closed",
    department: "HR",
    type: "Full time",
  },
  {
    job: "Social Media Manager",
    date: "Mar 21, 2020",
    candidates: 2,
    vacancies: 1,
    status: "Closed",
    department: "Marketing",
    type: "Full time",
  },
  {
    job: "Marketing Specialist",
    date: "Apr 27, 2024",
    candidates: 4,
    vacancies: 2,
    status: "Draft",
    department: "Marketing",
    type: "Full time",
  },
]

const statusColor = {
  Published: "bg-green-100 text-green-700",
  Closed: "bg-red-100 text-red-700",
  Draft: "bg-gray-100 text-gray-600",
  Pending: "bg-yellow-100 text-yellow-700",
}

export default function JobDetails() {
  const navigate = useNavigate()
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("")
  const [dynamicLink, setDynamicLink] = useState<string>("")

  const formatJobSlug = (title: string) => title.toLowerCase().replace(/\s+/g, "")

  // Handle job title click with useState
  const handleJobTitleClick = (jobTitle: string) => {
    setSelectedJobTitle(jobTitle)
    const jobSlug = formatJobSlug(jobTitle)
    const generatedLink = `/applicants/job/${jobSlug}`
    setDynamicLink(generatedLink)

    // Navigate with state
    navigate(generatedLink, {
      state: {
        jobTitle: jobTitle,
        jobData: jobData.find((job) => job.job === jobTitle),
      },
    })
  }

  useEffect(() => {
    document.title = "Applicants | Job Details"
  }, [])

  useEffect(() => {
    if (selectedJobTitle) {
      console.log(`Selected Job: ${selectedJobTitle}`)
      console.log(`Dynamic Link: ${dynamicLink}`)
    }
  }, [selectedJobTitle, dynamicLink])

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 p-6 pt-[100px]">
        <div className="mx-auto max-w-7xl space-y-4">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800">Applicants</h1>

          {/* Show selected job info */}
          {selectedJobTitle && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                Last selected: <span className="font-semibold">{selectedJobTitle}</span>
              </p>
              <p className="text-xs text-blue-600">Dynamic link: {dynamicLink}</p>
            </div>
          )}

          {/* Filters */}
          <div className="w-full space-y-2">
            {/* Clear filters */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => {
                  setSelectedJobTitle("")
                  setDynamicLink("")
                }}
                className="text-medium text-blue-500 hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            </div>

            {/* Search bar and filters */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              {/* Search bar */}
              <Input placeholder="Search applicants..." className="w-64" />

              {/* Filter dropdowns */}
              <div className="flex flex-wrap gap-2 ml-auto">
                {["All Internal", "All Status", "All Job Position", "All Departments", "Employment Type"].map(
                  (label) => (
                    <Select key={label}>
                      <SelectTrigger className="min-w-[160px] bg-gray-100">
                        <SelectValue placeholder={label} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{label}</SelectItem>
                      </SelectContent>
                    </Select>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Job Table */}
          <div className="w-full overflow-auto rounded-lg border">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Job</th>
                  <th className="px-4 py-2">Position Created</th>
                  <th className="px-4 py-2">Total Candidates</th>
                  <th className="px-4 py-2">Vacancies</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Department</th>
                  <th className="px-4 py-2">Employment Type</th>
                </tr>
              </thead>
              <tbody>
                {jobData.map((job, i) => (
                  <tr key={i} className="border-t text-sm text-gray-800">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleJobTitleClick(job.job)}
                        className="text-left hover:underline hover:text-blue-600 transition-colors cursor-pointer"
                        style={{ color: "#343a40" }}
                      >
                        {job.job}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <CalendarDays className="w-4 h-4" />
                        <span>{job.date}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{job.candidates}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">{job.vacancies}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${statusColor[job.status as keyof typeof statusColor]}`}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">{job.department}</td>

                    <td className="px-4 py-3">
                      <Badge className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5" variant="outline">
                        {job.type}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/applicants")}
              className="flex items-center text-blue-500 text-sm hover:underline"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
