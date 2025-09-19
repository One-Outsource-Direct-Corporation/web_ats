"use client"

import { Navbar } from "@/components/reusables/Navbar"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { ChevronRightCircle, CalendarDays, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
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

  const formatJobSlug = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "")

  const handleJobTitleClick = (jobTitle: string) => {
    setSelectedJobTitle(jobTitle)
    const jobSlug = formatJobSlug(jobTitle)
    const generatedLink = `/job/${jobSlug}`
    setDynamicLink(generatedLink)

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

  return (
    <>
      <Navbar />

      <div className="flex flex-col min-h-screen pt-[150px] bg-gray-50">
        {/* Fixed top filter/search section */}
        <div className="fixed top-[64px] left-0 right-0 z-20 bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
          <div className="max-w-7xl mx-auto -space-y-2">

            <h1 className="text-3xl font-bold text-gray-800">Applicants</h1>
            <p className="text-lg text-gray-700 mt-5">Stores candidate details and tracks their application progress.</p>
            {selectedJobTitle && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  Last selected:{" "}
                  <span className="font-semibold">{selectedJobTitle}</span>
                </p>
                <p className="text-xs text-blue-600">Dynamic link: {dynamicLink}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedJobTitle("")
                  setDynamicLink("")
                }}
                className="text-sm text-blue-500 hover:underline cursor-pointer pb-2"
              >
                Clear filters
              </button>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4">
              <Input placeholder="Search applicants..." className="w-64" />
              <div className="flex flex-wrap gap-2 ml-auto">
                {[
                  "All Internal",
                  "All Status",
                  "All Job Position",
                  "All Departments",
                  "Employment Type",
                ].map((label) => (
                  <Select key={label}>
                    <SelectTrigger className="min-w-[160px] bg-gray-100">
                      <SelectValue placeholder={label} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{label}</SelectItem>
                    </SelectContent>
                  </Select>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main content table section */}
        <main className="flex-grow px-6 pt-[120px] pb-[80px] max-w-7xl mx-auto w-full">
          <div className="overflow-auto rounded-lg border bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Job</th>
                  <th className="px-4 py-2 text-center">Position Created</th>
                  <th className="px-4 py-2 text-center">Total Candidates</th>
                  <th className="px-4 py-2 text-center">Vacancies</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center">Department</th>
                  <th className="px-4 py-2 text-center">Employment Type</th>
                </tr>
              </thead>
              <tbody>
                {jobData.map((job, i) => (
                  <tr key={i} className="border-t text-sm text-gray-800">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleJobTitleClick(job.job)}
                        className="text-left hover:underline hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {job.job}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <CalendarDays className="w-4 h-4" />
                        <span>{job.date}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{job.candidates}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{job.vacancies}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${
                          statusColor[job.status as keyof typeof statusColor]
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{job.department}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5"
                        variant="outline"
                      >
                        {job.type}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* Footer with All Applicants button */}
        <footer className="fixed bottom-0 left-0 right-0 border-t bg-white px-6 py-4 z-30 shadow-md">
  <div className="max-w-7xl mx-auto flex justify-end">
    <button
      onClick={() => navigate("/job/list/applicants")}
      className="flex items-center text-blue-500 text-sm hover:underline"
    >
      <ChevronRightCircle className="w-4 h-4 mr-1" />
      All Applicants
    </button>
  </div>
</footer>

      </div>
    </>
  )
}
