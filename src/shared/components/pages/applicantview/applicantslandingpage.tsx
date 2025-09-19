"use client"

import { useState } from "react"
import {
  Search,
  FileCode2,
  SquareActivity,
  ShieldCheck,
  FileLineChartIcon as FileChartLine,
  MapPinned,
  FolderIcon as FolderCode,
  Facebook,
  Briefcase,
  Linkedin,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppNavigation } from "@/hooks/use-navigation"

interface JobData {
  id: number
  title: string
  icon: any
  department: string
  role: string
  description: string
  filters: string[]
  daysAgo: number
  applicants: string
  category: string
  workType: string
  workSetup: string
}

export default function ApplicantLandingPage() {
  const navigation = useAppNavigation()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [workTypeFilter, setWorkTypeFilter] = useState("All")
  const [workSetupFilter, setWorkSetupFilter] = useState("All")
  const [isSearchActive, setIsSearchActive] = useState(false)

  const jobCards: JobData[] = [
    {
      id: 1,
      title: "Lead Developer",
      icon: FileCode2,
      department: "Engineering",
      role: "Supervisory",
      description: "Seeking a skilled Lead Developer to manage projects, mentor teams, and drive technical excellence.",
      filters: ["Full-time", "Hybrid", "Senior-level"],
      daysAgo: 2,
      applicants: "150+",
      category: "Senior-level",
      workType: "Full-time",
      workSetup: "Hybrid",
    },
    {
      id: 2,
      title: "Sales Support",
      icon: SquareActivity,
      department: "Sales",
      role: "Rank and File",
      description:
        "Join our sales team to provide exceptional customer support and drive revenue growth through client relationships.",
      filters: ["Full-time", "Onsite", "Entry-level"],
      daysAgo: 5,
      applicants: "89+",
      category: "Entry-level",
      workType: "Full-time",
      workSetup: "Onsite",
    },
    {
      id: 3,
      title: "IT Quality Assurance",
      icon: ShieldCheck,
      department: "Technology",
      role: "Rank and File",
      description:
        "Ensure software quality through comprehensive testing, bug identification, and process improvement initiatives.",
      filters: ["Full-time", "Remote", "Mid-level"],
      daysAgo: 1,
      applicants: "67+",
      category: "Mid-level",
      workType: "Full-time",
      workSetup: "Remote",
    },
    {
      id: 4,
      title: "Business Analyst",
      icon: FileChartLine,
      department: "Operations",
      role: "Supervisory",
      description:
        "Analyze business processes, identify improvement opportunities, and bridge the gap between IT and business needs.",
      filters: ["Full-time", "Hybrid", "Mid-level"],
      daysAgo: 3,
      applicants: "124+",
      category: "Mid-level",
      workType: "Full-time",
      workSetup: "Hybrid",
    },
    {
      id: 5,
      title: "Field Inspector",
      icon: MapPinned,
      department: "Operations",
      role: "Rank and File",
      description:
        "Conduct on-site inspections, ensure compliance with safety standards, and maintain detailed inspection reports.",
      filters: ["Part-time", "Onsite", "Entry-level"],
      daysAgo: 7,
      applicants: "45+",
      category: "Entry-level",
      workType: "Part-time",
      workSetup: "Onsite",
    },
    {
      id: 6,
      title: "Software Engineer II",
      icon: FolderCode,
      department: "Engineering",
      role: "Rank and File",
      description:
        "Develop and maintain software applications, collaborate with cross-functional teams, and contribute to technical solutions.",
      filters: ["Full-time", "Remote", "Mid-level"],
      daysAgo: 4,
      applicants: "203+",
      category: "Mid-level",
      workType: "Full-time",
      workSetup: "Remote",
    },
  ]

  const handleSearch = () => {
    setIsSearchActive(true)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("All")
    setWorkTypeFilter("All")
    setWorkSetupFilter("All")
    setIsSearchActive(false)
  }

  const handleApplyNow = (job: JobData) => {
    navigation.goToJobDescription(job)
  }

  const handleTrackApplication = () => {
    navigation.goToTracker()
  }

  const filteredJobs = isSearchActive
    ? jobCards.filter((job) => {
        const matchesSearch =
          searchTerm === "" ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory = categoryFilter === "All" || job.category === categoryFilter
        const matchesWorkType = workTypeFilter === "All" || job.workType === workTypeFilter
        const matchesWorkSetup = workSetupFilter === "All" || job.workSetup === workSetupFilter

        return matchesSearch && matchesCategory && matchesWorkType && matchesWorkSetup
      })
    : jobCards

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="w-full mt-0 p-4 flex items-center justify-between bg-white shadow-md rounded-b-2xl">
          <div className="flex items-center gap-4 ml-6">
            <div className="text-2xl font-bold text-blue-600">
              <img src="/OODC logo2.png" alt="OODC Logo" className="h-24 mx-auto" />
            </div>
          </div>
          <Button
            onClick={handleTrackApplication}
            className="border-2 border-blue-500 bg-white text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200 mr-6"
          >
            Track Application
          </Button>
        </header>

        {/* Middle Content Container with Job Opening Pill */}
        <div className="relative flex-1">
          {/* Job Openings Pill - Left Side of Middle Content */}
          <div className="absolute top-1/2 transform -translate-y-70 z-30">
            <div
              className="bg-blue-600 rounded-br-2xl rounded-tr-2xl flex items-center justify-center shadow-lg"
              style={{ padding: "5px", height: "160px", width: "40px" }}
            >
              <div className="transform rotate-90 whitespace-nowrap">
                <span className="text-white font-bold text-xl tracking-wider">JOB OPENING</span>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mx-auto max-w-6xl mt-6 bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Input
                    placeholder="Search jobs..."
                    className="pr-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="min-w-[150px]">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior-level">Senior-level</SelectItem>
                    <SelectItem value="Executive/Management">Executive/Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[150px]">
                <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Work Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Work Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Temporary employment">Temporary employment</SelectItem>
                    <SelectItem value="Internships">Internships</SelectItem>
                    <SelectItem value="Apprenticeships">Apprenticeships</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[150px]">
                <Select value={workSetupFilter} onValueChange={setWorkSetupFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Work Setup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Work Setup</SelectItem>
                    <SelectItem value="Onsite">Onsite</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6" onClick={handleSearch}>
                  Search
                </Button>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div className="mx-auto max-w-6xl mt-6 mb-16 bg-white rounded-lg shadow-sm p-6 relative z-20">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => {
                  const IconComponent = job.icon
                  return (
                    <div
                      key={job.id}
                      className="border border-gray-200 rounded-lg p-6 shadow-xl/20 hover:shadow-md transition-shadow"
                    >
                      {/* Header with Icon and Title */}
                      <div className="flex items-start gap-3 mb-3">
                        <IconComponent className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">{job.title}</h3>
                      </div>

                      {/* Department and Role */}
                      <div className="text-sm text-gray-600 mb-3">
                        {job.department} • {job.role}
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{job.description}</p>

                      {/* Filter Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.filters.map((filter, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {filter}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="space-y-3">
                        <div className="text-sm text-gray-500">
                          Opened {job.daysAgo} days ago |{" "}
                          <span className="text-green-600 font-medium">{job.applicants} Applicants</span>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleApplyNow(job)}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full mx-auto h-30 mt-0 bg-blue-600 rounded-t-2xl p-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center gap-6 mb-4">
              <Facebook className="h-6 w-6 text-white" />
              <Briefcase className="h-6 w-6 text-white" />
              <Linkedin className="h-6 w-6 text-white" />
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div className="text-white text-sm">© 2025 One Outsource Direct Group • Privacy • Terms • Sitemap</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
