import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, NotebookPen, ClipboardList, Calendar, Users, UserCheck, MessageSquare, Clock, MapPin, Video, Pin, FolderSearch, FolderSearch2, CircleUser, ClockAlert } from "lucide-react"
import { Navbar } from "@/components/reusables/Navbar"
import { useEffect } from "react"

export default function Dashboard() {
    useEffect(() => {
    document.title = "Dashboard";
  }, []);

  // Sample data
  const weekDays = [
  {
    day: "Mon", date: "15", events: [
      { event: "Interview", candidate: "Sarah Johnson", avatar: "https://i.pravatar.cc/40?img=1", type: "phone" },
      { event: "Assessment", candidate: "Mike Chen", avatar: "https://i.pravatar.cc/40?img=2", type: "notebookpen" }
    ]
  },
  {
    day: "Tue", date: "16", events: [{ event: "Assessment", candidate: "Emily Davis", avatar: "https://i.pravatar.cc/40?img=3", type: "phone-red" }]
  },
  {
    day: "Wed", date: "17", events: []
  },
  {
    day: "Thu", date: "18", events: [
      { event: "Final Interview", candidate: "Alex Rodriguez", avatar: "https://i.pravatar.cc/40?img=4", type: "phone-red" },
    ]
  },
  {
    day: "Fri", date: "19", events: []
  },
  {
    day: "Sat", date: "20", events: [
      { event: "Task Test", candidate: "Lisa Wang", avatar: "https://i.pravatar.cc/40?img=5", type: "clipboard" }
    ]
  },
  {
    day: "Sun", date: "21", events: []
  },
];

  // Helper function to generate pastel colors with opacity
const getPastelColor = (color: string, opacity: number = 0.3) => {
  // Define base colors
  const colorMap: Record<string, string> = {
    'bg-blue-500': 'rgba(59, 130, 246', // Blue
    'bg-green-500': 'rgba(34, 197, 94', // Green
    'bg-orange-500': 'rgba(251, 146, 60', // Orange
    'bg-purple-500': 'rgba(139, 92, 246', // Purple
  };
  
  // If the color is in our map, return it with the opacity appended
  if (colorMap[color]) {
    return `${colorMap[color]}, ${opacity})`;
  }

  return color; // If not found, return the color as is
};

// Helper function to generate border color based on the bg color
const getBorderColor = (color: string) => {
  const colorMap: Record<string, string> = {
    'bg-blue-500': '#1D4ED8', // Blue border
    'bg-green-500': '#10B981', // Green border
    'bg-orange-500': '#FB923C', // Orange border
    'bg-purple-500': '#7C3AED', // Purple border
  };

  return colorMap[color] || color; // Return the mapped color or the original color
};



  // Function to return the corresponding icon based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case "phone":
        return <Phone className="w-4 h-4 text-blue-500" />;
      case "phone-red":
        return <Phone className="w-4 h-4 text-red-500" />;
      case "notebookpen":
        return <NotebookPen className="w-4 h-4 text-yellow-500" />;
      case "clipboard":
        return <ClipboardList className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

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
    avatar: "https://i.pravatar.cc/40?img=6",
  },
  {
    name: "Mike Chen",
    job: "Backend Developer",
    status: "Assessment",
    avatar: "https://i.pravatar.cc/40?img=7",
  },
  {
    name: "Emily Davis", 
    job: "UI/UX Designer", 
    status: "Offer Sent", 
    avatar: "https://i.pravatar.cc/40?img=8"
  },
  {
    name: "Alex Rodriguez",
    job: "Product Manager",
    status: "Interview",
    avatar: "https://i.pravatar.cc/40?img=9",
  },
  {
    name: "Lisa Wang",
    job: "Frontend Developer",
    status: "Assessment",
    avatar: "https://i.pravatar.cc/40?img=10",
  },
];

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
          type: "Final Interview",
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
                  <div className="overflow-x-auto">
                    {/* Container for the calendar and legend */}
                    <div className="flex flex-col lg:space-y-4">
                      {/* Calendar Grid: Horizontal for desktop */}
                      <div className="flex space-x-4 lg:space-x-6">
                        {weekDays.map((day, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center w-28 border border-gray-300 rounded-lg p-2"
                          >
                            <div className="text-xs font-medium text-gray-500">{day.day}</div>
                            <div className="text-sm font-medium text-gray-900">{day.date}</div>
                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                              {day.events.length > 0 ? (
                                day.events.map((event, idx) => (
                                  <div key={idx} className="flex items-center space-x-1">
                                    <Avatar className="w-6 h-6">
  <AvatarImage src={event.avatar} alt={`Avatar for ${event.candidate}`} />
  <AvatarFallback>
    {event.candidate.split(" ")[0][0]} {/* This shows the first letter of the first name */}
  </AvatarFallback>
</Avatar>
                                    <div className="w-4 h-4">{getEventIcon(event.type)}</div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-xs text-gray-400">No Events</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Legend Below the Calendar */}
                      <div className="flex flex-wrap justify-start lg:justify-center space-x-4 text-xs text-gray-500 mt-6">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4 text-blue-500" />
                          <span>Phone Interview</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4 text-red-500" />
                          <span>Final Phone Interview</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <NotebookPen className="w-4 h-4 text-yellow-500" />
                          <span>Assessment</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClipboardList className="w-4 h-4 text-purple-500" />
                          <span>Task Test</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

    {/* Recruitment Process */}
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2 -mb-5">
            <FolderSearch /> Recruitment
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
    {/* Job Table */}
    <div className="flex-1 overflow-x-auto">
      <div className="overflow-x-auto w-full">
      <Table className="table-auto w-full">
    <TableHeader>
      <TableRow>
        <TableHead className="text-sm sm:text-base min-w-[200px]">
          Job
        </TableHead>
        <TableHead className="text-sm sm:text-base min-w-[200px]">
          <div className="flex flex-col text-center">
            <span>Total</span>
            <span>Candidates</span>
          </div>
        </TableHead>
        <TableHead className="text-sm sm:text-base min-w-[150px]">
          Vacancies
        </TableHead>
        <TableHead className="text-sm sm:text-base min-w-[150px]">
          Expiration
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {jobData.map((job, index) => (
        <TableRow key={index} className="odd:bg-gray-100 even:bg-white">
          <TableCell className="font-medium break-words min-w-[200px] whitespace-normal">
            {job.job}
          </TableCell>
          <TableCell className="flex items-center gap-2 min-w-[200px] break-words whitespace-normal">
            <FolderSearch2/>{job.candidates}
          </TableCell>
          <TableCell className="min-w-[150px] break-words whitespace-normal">
            {job.vacancies}
          </TableCell>
          <TableCell className="min-w-[150px] break-words whitespace-normal text-sm text-gray-500">
            {job.expiration}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

      </div>
    </div>

    <Separator orientation="vertical" className="bg-border w-[1px] hidden md:block" />

    {/* Ongoing Processes */}
    <div className="flex-1 space-y-4 mt-6 md:mt-0">
      <h3 className="font-semibold text-gray-900">Ongoing Process</h3>
      <div className="space-y-3">
        {ongoingProcesses.map((process, index) => (
  <div key={index} className="flex items-center justify-between rounded-lg border p-3">
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={process.avatar} alt={process.name} />
        <AvatarFallback>
          {process.name.split(" ").map((n) => n[0]).join("")}
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
      <Card key={index} className="p-4" style={{ backgroundColor: `${getPastelColor(metric.color)}` }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Icon with a thicker border */}
            <div
              className={`rounded-lg p-2 border-4 ${getPastelColor(metric.color)}`}
              style={{
                backgroundColor: `${getPastelColor(metric.color, 0.2)}`, // More transparent for the icon background
                borderColor: `${getBorderColor(metric.color)}`, // Dynamic border color based on the background
                borderRadius: '9999px', // Optional: to make sure the border is rounded
              }}
            >
              <metric.icon className="h-4 w-4 text-white" />
            </div>
            {/* Text Section */}
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
      <CardTitle>
        <div className="flex items-center gap-2">
          <Pin />
          Scheduled Interviews
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      {interviews.map((day, dayIndex) => (
        <div key={dayIndex} className="space-y-4">
          {/* Day Name */}
          <h3 className="mb-2 font-semibold text-gray-900">{day.date}</h3>
          
          {/* Interview Sessions for the day */}
          <div className="space-y-3">
            {day.sessions.map((session, sessionIndex) => (
              <div key={sessionIndex} className="rounded-lg bg-gray-100 p-4">
                <div className="flex items-start justify-between">
                  {/* Session Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <Clock className="h-4 w-4" />
                      {session.time} • {session.type}
                    </div>
                  </div>

                  {/* Job Info and Candidate */}
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{session.job}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 justify-end">
                      <CircleUser className="h-3 w-3" />
                      {session.candidate}
                    </div>

                    {/* Session Details */}
                    <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                      <ClockAlert className="h-3 w-3" />
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
