"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Facebook, Briefcase, Linkedin, Mail } from "lucide-react"
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

interface ApplicationData {
  jobTitle: string
  jobReq: string
  status: "Received" | "On Hold" | "Hired"
  date: string
}

interface TaskData {
  jobTitle: string
  jobReq: string
  taskTitle: string
  taskStatus: "Done" | "Pending"
  scheduledDate: string
}

interface JobOfferData {
  jobTitle: string
  jobReq: string
  date: string
}

interface EventData {
  date: string
  month: string
  day: string
  title: string
  location?: string
  type: "Interview" | "Examination" | "Upload Documents"
}

const mockApplications: ApplicationData[] = [
  { jobTitle: "Software Engineer", jobReq: "REQ123", status: "Received", date: "2023-10-01" },
  { jobTitle: "Product Manager", jobReq: "REQ456", status: "On Hold", date: "2023-09-25" },
  { jobTitle: "Data Scientist", jobReq: "REQ789", status: "Hired", date: "2023-09-10" },
]

const mockTasks: TaskData[] = [
  {
    jobTitle: "Software Engineer",
    jobReq: "REQ123",
    taskTitle: "Task 1",
    taskStatus: "Done",
    scheduledDate: "2023-10-05",
  },
  {
    jobTitle: "Product Manager",
    jobReq: "REQ456",
    taskTitle: "Task 2",
    taskStatus: "Pending",
    scheduledDate: "2023-10-10",
  },
]

const mockJobOffers: JobOfferData[] = [{ jobTitle: "Software Engineer", jobReq: "REQ123", date: "2023-10-15" }]

const mockEvents: EventData[] = [
  { date: "2023-10-01", month: "Oct", day: "1", title: "Interview", location: "Building A", type: "Interview" },
  { date: "2023-10-10", month: "Oct", day: "10", title: "Examination", type: "Examination" },
  { date: "2023-10-15", month: "Oct", day: "15", title: "Upload Documents", type: "Upload Documents" },
]

export default function TrackApplicationPage() {
  const navigation = useAppNavigation()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Get search query from navigation state
  const searchQuery = navigation.getSearchQuery()
  const [trackingCode, setTrackingCode] = useState(searchQuery || "")
  const [showResults, setShowResults] = useState(!!searchQuery)

  // Clear search query after using it to prevent it from persisting
  useEffect(() => {
    if (searchQuery) {
      navigation.clearSearchQuery()
    }
  }, [searchQuery])

  const handleSearch = () => {
    if (trackingCode.trim()) {
      setShowResults(true)
    }
  }

  const handleJobOpenings = () => {
    navigation.goToJobOpenings()
  }

  // Function to handle logo click, navigating to job openings
  const handleLogoClick = () => {
    navigation.goToJobOpenings()
  }

  const getStatusBadge = (status: "Received" | "On Hold" | "Hired") => {
    const styles = {
      Received: "bg-green-100 text-green-800",
      "On Hold": "bg-yellow-100 text-yellow-800",
      Hired: "bg-blue-100 text-blue-800",
    }
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>{status}</span>
  }

  const getTaskStatusBadge = (status: "Done" | "Pending") => {
    const styles = {
      Done: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
    }
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>{status}</span>
  }

  const getEventTypeBadge = (type: "Interview" | "Examination" | "Upload Documents") => {
    const styles = {
      Interview: "bg-blue-100 text-blue-800",
      Examination: "bg-green-100 text-green-800",
      "Upload Documents": "bg-red-100 text-red-800",
    }
    return <span className={`px-2 py-1 rounded text-xs font-medium ${styles[type]}`}>{type}</span>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - Same as applicant landing page but without Track Application button */}
      <header className="w-full mt-0 p-4 flex items-center justify-between bg-white shadow-md rounded-b-2xl">
        <div className="flex items-center gap-4 ml-6">
          {/* Logo - Made clickable */}
          <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={handleLogoClick}>
            <img src="/OODC logo2.png" alt="OODC Logo" className="h-24 mx-auto" />
          </div>
        </div>
        {/* No Track Application button since we're already on the track page */}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Column (70%) */}
        <div className="w-full lg:w-[70%] p-6">
          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                onClick={handleSearch}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>

              <div className="w-full sm:flex-1">
                <Input
                  placeholder="Enter your tracking code (e.g., ABC123)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <Button
                variant="outline"
                onClick={handleJobOpenings}
                className="w-full sm:w-auto text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent px-6 py-2"
              >
                Job Openings
              </Button>
            </div>
          </div>

          {/* Results Section - Only show when search is performed */}
          {showResults && (
            <>
              {/* Progress Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-blue-600">Progress</h2>
                  <div className="flex-1 h-px bg-blue-600"></div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="px-4 py-3 text-left">Job Title</th>
                        <th className="px-4 py-3 text-left">Job Req</th>
                        <th className="px-4 py-3 text-left">Application Status</th>
                        <th className="px-4 py-3 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockApplications.map((app, index) => (
                        <tr key={index} className="border-t border-gray-300">
                          <td className="px-4 py-3 text-gray-900">{app.jobTitle}</td>
                          <td className="px-4 py-3 text-gray-900">{app.jobReq}</td>
                          <td className="px-4 py-3">{getStatusBadge(app.status)}</td>
                          <td className="px-4 py-3 text-gray-900">{app.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* My Tasks Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-blue-600">My Tasks</h2>
                  <div className="flex-1 h-px bg-blue-600"></div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="px-4 py-3 text-left">Job Title</th>
                        <th className="px-4 py-3 text-left">Task Title</th>
                        <th className="px-4 py-3 text-left">Task Status</th>
                        <th className="px-4 py-3 text-left">Scheduled Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTasks.map((task, index) => (
                        <tr key={index} className="border-t border-gray-300">
                          <td className="px-4 py-3">
                            <div className="text-gray-900">{task.jobTitle}</div>
                            <div className="text-gray-500 text-sm">{task.jobReq}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-900">{task.taskTitle}</td>
                          <td className="px-4 py-3">{getTaskStatusBadge(task.taskStatus)}</td>
                          <td className="px-4 py-3 text-gray-900">{task.scheduledDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Job Offer Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-blue-600">Job Offer</h2>
                  <div className="flex-1 h-px bg-blue-600"></div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="px-4 py-3 text-left">Job Title</th>
                        <th className="px-4 py-3 text-left">Task Action</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Documents</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockJobOffers.map((offer, index) => (
                        <tr key={index} className="border-t border-gray-300">
                          <td className="px-4 py-3">
                            <div className="text-gray-900">{offer.jobTitle}</div>
                            <div className="text-gray-500 text-sm">{offer.jobReq}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-200">
                                Accept
                              </button>
                              <button className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200">
                                Reject
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-900">{offer.date}</td>
                          <td className="px-4 py-3">
                            <Button
                              onClick={() => navigation.goToDocuments()}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-sm"
                            >
                              Add
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* No Results Message */}
          {!showResults && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Enter Your Tracking Code</h3>
              <p className="text-gray-600">
                Please enter your tracking code in the search field above to view your application status and tasks.
              </p>
            </div>
          )}
        </div>

        {/* Right Column (30%) */}
        <div className="w-full lg:w-[30%] p-6 pt-0 lg:pt-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-center">
            {/* Calendar component with fixed weeks and no padding */}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0 p-0 w-full" /* Removed padding and set width to full */
              fixedWeeks={true} /* Ensures the calendar always shows 5 weeks */
            />
          </div>

          {/* Events Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold text-blue-600">Events</h2>
              <div className="flex-1 h-px bg-blue-600"></div>
            </div>

            <div className="space-y-4">
              {mockEvents.map((event, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{event.month}</div>
                        <div className="text-2xl font-bold text-blue-600">{event.day}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                        {event.location && <p className="text-sm text-gray-600">{event.location}</p>}
                      </div>
                    </div>
                    <div className="ml-2 whitespace-nowrap">{getEventTypeBadge(event.type)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
  )
}
