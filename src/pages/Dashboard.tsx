import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, UserCheck, MessageSquare, Clock, MapPin, Video } from "lucide-react"
import { Navbar } from "@/reusables/Navbar"

export default function Dashboard() {
  // Sample data
  const weekDays = [
    { day: "Mon", date: "15", events: 2 },
    { day: "Tue", date: "16", events: 0 },
    { day: "Wed", date: "17", events: 1 },
    { day: "Thu", date: "18", events: 3 },
    { day: "Fri", date: "19", events: 0 },
    { day: "Sat", date: "20", events: 1 },
    { day: "Sun", date: "21", events: 0 },
  ]

  const jobData = [
    { job: "Frontend Developer", candidates: 24, vacancies: 2, expiration: "2024-01-30" },
    { job: "Backend Developer", candidates: 18, vacancies: 1, expiration: "2024-02-15" },
    { job: "UI/UX Designer", candidates: 32, vacancies: 3, expiration: "2024-01-25" },
    { job: "Product Manager", candidates: 15, vacancies: 1, expiration: "2024-02-10" },
  ]

  const ongoingProcesses = [
    {
      name: "Sarah Johnson",
      job: "Frontend Developer",
      status: "Interview",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Mike Chen",
      job: "Backend Developer",
      status: "Assessment",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    { name: "Emily Davis", job: "UI/UX Designer", status: "Offer Sent", avatar: "/placeholder.svg?height=40&width=40" },
    {
      name: "Alex Rodriguez",
      job: "Product Manager",
      status: "Interview",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Lisa Wang",
      job: "Frontend Developer",
      status: "Assessment",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const metrics = [
    { title: "Job Opening", value: "12", icon: Users, color: "bg-blue-500" },
    { title: "New Candidates", value: "89", icon: UserCheck, color: "bg-green-500" },
    { title: "Invited for Interview", value: "23", icon: MessageSquare, color: "bg-orange-500" },
    { title: "Waiting for Feedbacks", value: "7", icon: Clock, color: "bg-purple-500" },
  ]

  const interviews = [
    {
      date: "Today, Jan 15",
      sessions: [
        {
          time: "09:00 AM",
          type: "1st Interview",
          job: "Frontend Developer",
          candidate: "Sarah Johnson",
          duration: "45 min",
          location: "Conference Room A",
        },
        {
          time: "02:00 PM",
          type: "Final Interview",
          job: "Product Manager",
          candidate: "Alex Rodriguez",
          duration: "60 min",
          location: "Online",
        },
      ],
    },
    {
      date: "Tomorrow, Jan 16",
      sessions: [
        {
          time: "10:30 AM",
          type: "Task Test",
          job: "Backend Developer",
          candidate: "Mike Chen",
          duration: "90 min",
          location: "Online",
        },
        {
          time: "03:30 PM",
          type: "1st Interview",
          job: "UI/UX Designer",
          candidate: "Emily Davis",
          duration: "45 min",
          location: "Conference Room B",
        },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Interview":
        return "bg-blue-100 text-blue-800"
      case "Assessment":
        return "bg-yellow-100 text-yellow-800"
      case "Offer Sent":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
      <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 pt-[100px]">
        <div className="mx-auto max-w-7xl space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm font-medium text-gray-500">{day.day}</div>
                      <div
                        className={`mt-1 flex h-12 w-12 items-center justify-center rounded-lg text-lg font-semibold ${
                          day.events > 0 ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {day.date}
                      </div>
                      {day.events > 0 && <div className="mt-1 text-xs text-blue-600">{day.events} events</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recruitment Process */}
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  {/* Job Table */}
                  <div className="flex-1">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job</TableHead>
                          <TableHead>Total Candidates</TableHead>
                          <TableHead>Vacancies</TableHead>
                          <TableHead>Expiration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobData.map((job, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{job.job}</TableCell>
                            <TableCell>{job.candidates}</TableCell>
                            <TableCell>{job.vacancies}</TableCell>
                            <TableCell className="text-sm text-gray-500">{job.expiration}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Separator orientation="vertical" />

                  {/* Ongoing Processes */}
                  <div className="flex-1 space-y-4">
                    <h3 className="font-semibold text-gray-900">Ongoing Process</h3>
                    <div className="space-y-3">
                      {ongoingProcesses.map((process, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={process.avatar || "/placeholder.svg"} alt={process.name} />
                              <AvatarFallback>
                                {process.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{process.name}</div>
                              <div className="text-sm text-gray-500">{process.job}</div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(process.status)}>{process.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${metric.color}`}>
                        <metric.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <div className="text-sm text-gray-500">{metric.title}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Interviews */}
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Interviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {interviews.map((day, dayIndex) => (
                  <div key={dayIndex}>
                    <h3 className="mb-3 font-semibold text-gray-900">{day.date}</h3>
                    <div className="space-y-3">
                      {day.sessions.map((session, sessionIndex) => (
                        <div key={sessionIndex} className="rounded-lg bg-gray-100 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                <Clock className="h-4 w-4" />
                                {session.time} • {session.type}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">{session.job}</div>
                              <div className="text-sm text-gray-600">{session.candidate}</div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{session.duration}</span>
                                <div className="flex items-center gap-1">
                                  {session.location === "Online" ? (
                                    <Video className="h-3 w-3" />
                                  ) : (
                                    <MapPin className="h-3 w-3" />
                                  )}
                                  {session.location}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    
  
</>
  )
}
