"use client"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Briefcase,
  Mail,
  MessageSquare,
  CheckSquare,
  Download,
  Send,
  Smile,
  ChevronRight,
  MapPin,
  Phone,
  FileText,
  Trash2,
  Upload,
  Scaling,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Navbar } from "@/components/reusables/Navbar"
import AnsweredForm from "@/components/forms/AnsweredForm"

const applicantsData = {
  "maria-white": {
    name: "Maria White",
    email: "maria.white@email.com",
    position: "Project Manager",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, San Francisco, CA",
    avatar: "https://i.pravatar.cc/64?img=1",
    status: "Hired",
  },
  "carmen-martinez": {
    name: "Carmen Martinez",
    email: "carmen.martinez@email.com",
    position: "Social Media Manager",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, Los Angeles, CA",
    avatar: "https://i.pravatar.cc/64?img=2",
    status: "Failed",
  },
  "olivia-miller": {
    name: "Olivia Miller",
    email: "olivia.miller@email.com",
    position: "Senior UI/UX Designer",
    phone: "+1 (555) 345-6789",
    address: "789 Pine St, Seattle, WA",
    avatar: "https://i.pravatar.cc/64?img=3",
    status: "Warm",
  },
  "jessica-gonzalez": {
    name: "Jessica Gonzalez",
    email: "jessica.gonzalez@email.com",
    position: "Lead Developer",
    phone: "+1 (555) 456-7890",
    address: "321 Elm St, Austin, TX",
    avatar: "https://i.pravatar.cc/64?img=4",
    status: "Hired",
  },
  "rachel-miller": {
    name: "Rachel Miller",
    email: "rachel.miller@email.com",
    position: "Lead Developer",
    phone: "+1 (555) 567-8901",
    address: "654 Maple Dr, Denver, CO",
    avatar: "https://i.pravatar.cc/64?img=5",
    status: "Hired",
  },
  "nathan-wood": {
    name: "Nathan Wood",
    email: "nathan.wood@email.com",
    position: "QA Engineer",
    phone: "+1 (555) 678-9012",
    address: "987 Cedar Ln, Portland, OR",
    avatar: "https://i.pravatar.cc/64?img=7",
    status: "For Interview",
  },
  "sarah-white": {
    name: "Sarah White",
    email: "sarah.white@email.com",
    position: "QA Engineer",
    phone: "+1 (555) 789-0123",
    address: "147 Birch Rd, Phoenix, AZ",
    avatar: "https://i.pravatar.cc/64?img=8",
    status: "For Job Offer",
  },
  "michael-taylor": {
    name: "Michael Taylor",
    email: "michael.taylor@email.com",
    position: "Operations Manager",
    phone: "+1 (555) 890-1234",
    address: "258 Spruce St, Miami, FL",
    avatar: "https://i.pravatar.cc/64?img=9",
    status: "Onboarding",
  },
}

const progressStages = [
  { name: "Initial Interview", completed: true },
  { name: "Panel Interview", completed: true },
  { name: "HM Interview", completed: false, current: true },
  { name: "Final Interview", completed: false },
]

const workExperience = [
  {
    title: "Senior Software Engineer",
    employmentType: "Full-time",
    company: "TechCorp Inc",
    location: "Remote",
    startDate: "Jan 2022",
    endDate: "Present",
  },
  {
    title: "Software Engineer",
    employmentType: "Full-time",
    company: "StartupXYZ",
    location: "Onsite",
    startDate: "Jun 2020",
    endDate: "Dec 2021",
  },
  {
    title: "Junior Developer",
    employmentType: "Part-time",
    company: "WebSolutions",
    location: "Remote",
    startDate: "Jan 2019",
    endDate: "May 2020",
  },
]

const comments = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/32?img=12",
    content: "Great technical skills demonstrated during the coding challenge.",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    author: "Mike Chen",
    avatar: "https://i.pravatar.cc/32?img=5",
    content: "Strong communication skills and cultural fit.",
    timestamp: "1 day ago",
  },
]

const assessments = [
  {
    name: "Soft Skill Assessment",
    score: 73,
    description: "Evaluates communication, teamwork, and interpersonal skills.",
  },
  {
    name: "Technical Skill Assessment",
    score: 75,
    description: "Tests programming knowledge, problem-solving, and technical expertise.",
  },
  {
    name: "Core Values Assessment",
    score: 90,
    description: "Measures alignment with company culture and values.",
  },
]

function RadialChart({ score }: { score: number }) {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ]

  const getColors = (score: number) => {
    if (score < 75) return { main: "#ef4444", light: "#fecaca" } // red and light red
    if (score === 75) return { main: "#eab308", light: "#fef3c7" } // yellow and light yellow
    return { main: "#22c55e", light: "#bbf7d0" } // green and light green
  }

  const colors = getColors(score)

  return (
    <div className="pr-2">
      <ResponsiveContainer width={80} height={70}>
        <PieChart>
          <Pie
            data={data}
            cx={35}
            cy={35}
            innerRadius={20}
            outerRadius={30}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            <Cell fill={colors.main} />
            <Cell fill={colors.light} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

function HalfCircleChart({ score }: { score: number }) {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ]

  return (
    <div className="relative">
      <ResponsiveContainer width={200} height={100}>
        <PieChart>
          <Pie
            data={data}
            cx={100}
            cy={100}
            innerRadius={60}
            outerRadius={80}
            startAngle={180}
            endAngle={0}
            dataKey="value"
          >
            <Cell fill="#1e40af" />
            <Cell fill="#93c5fd" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-end justify-center pb-4">
        <span className="text-2xl font-bold text-blue-900">{score}%</span>
      </div>
    </div>
  )
}

export default function ApplicantTracker() {
  const [newComment, setNewComment] = useState("")
  const overallScore = Math.round(assessments.reduce((acc, curr) => acc + curr.score, 0) / assessments.length)
  const navigate = useNavigate()
  const { name } = useParams()
  type ApplicantKey = keyof typeof applicantsData

  // Get current applicant data or fallback to default
  const currentApplicant =
    name && name in applicantsData
      ? applicantsData[name as ApplicantKey]
      : {
          name: "John Doe",
          email: "john.doe@email.com",
          position: "Software Engineer",
          phone: "+1 (555) 123-4567",
          address: "123 Main St, San Francisco, CA",
          avatar: "https://i.pravatar.cc/64?img=1",
          status: "For Interview",
        }

  return (
    <>
      <Navbar />
      {/* Back button below the navbar, top-left of the page content */}

      <div className="min-h-screen bg-gray-50 p-6 pt-4">
        <div className="mx-auto max-w-7xl space-y-6 mt-20">
          <div className="px-6 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-blue-600 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Progress Bar Panel */}
            <Card>
              <CardContent className="p-6">
                {/* Heading */}
                <h3 className="mb-4 text-lg font-bold text-gray-800 text-center">Application Status</h3>

                {/* Responsive Progress Bar */}
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
                  {progressStages.map((stage, index) => (
                    <div key={stage.name} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`rounded-lg px-4 py-2 text-sm font-medium text-center ${
                            stage.current
                              ? "bg-blue-500 text-white"
                              : stage.completed
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {stage.name}
                        </div>
                      </div>

                      {/* Chevron only visible on wider screens */}
                      {index < progressStages.length - 1 && (
                        <ChevronRight className="mx-2 hidden sm:block h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Applicant Profile */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentApplicant.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {currentApplicant.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{currentApplicant.name}</h2>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{currentApplicant.position}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{currentApplicant.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{currentApplicant.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{currentApplicant.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Panels */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Left Panel (60%) */}
              <div className="md:col-span-3">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <Tabs defaultValue="information" className="h-full">
                      <TabsList className="flex flex-col sm:flex-row w-full">
                        <TabsTrigger value="information">Information</TabsTrigger>
                        <TabsTrigger value="answered-form">Answered Form</TabsTrigger>
                        <TabsTrigger value="document">Document</TabsTrigger>
                      </TabsList>

                      <TabsContent value="information" className="mt-6 space-y-6">
                        {/* Working Experience */}
                        <div>
                          <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500 p-2">
                              <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">Working Experience</h3>
                            </div>
                            <Badge variant="secondary">4 Years, 2 Months</Badge>
                          </div>

                          <div className="space-y-4">
                            {workExperience.map((exp, index) => (
                              <div key={index} className="relative">
                                <div className="flex">
                                  <div className="mr-4 flex flex-col items-center">
                                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                    {index < workExperience.length - 1 && (
                                      <div className="mt-2 h-16 w-px bg-gray-300"></div>
                                    )}
                                  </div>
                                  <div className="flex-1 pb-4">
                                    <h4 className="font-bold text-gray-900">{exp.title}</h4>
                                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-600">
                                      <span>{exp.employmentType}</span>
                                      <span className="text-gray-400">|</span>
                                      <span>
                                        {exp.company} - {exp.location}
                                      </span>
                                      <span className="text-gray-400">|</span>
                                      <span>
                                        {exp.startDate} - {exp.endDate}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cover Letter */}
                        <div>
                          <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500 p-2">
                              <Mail className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold">Cover Letter</h3>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm text-gray-700">
                              Dear Hiring Manager, I am writing to express my strong interest in the Software Engineer
                              position at your company. With over 4 years of experience in full-stack development and a
                              passion for creating innovative solutions...
                            </p>
                            <button className="mt-2 text-sm text-blue-600 hover:underline">Read more</button>
                          </div>
                        </div>

                        {/* Resume */}
                        <div>
                          <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500 p-2">
                              <CheckSquare className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold">Resume</h3>
                          </div>
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-3">
                              {/* File icon with PDF label */}
                              <div className="relative flex items-center justify-center rounded bg-blue-100 p-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <span className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded bg-white px-1 text-[10px] font-bold text-blue-600 shadow-sm">
                                  PDF
                                </span>
                              </div>
                              <span className="text-sm font-medium">
                                {currentApplicant.name.replace(/\s+/g, "_")}_Resume.pdf
                              </span>
                            </div>
                            <Button size="sm" variant="outline" className="w-full sm:w-auto">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>

                        {/* Comments */}
                        <div>
                          <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500 p-2">
                              <MessageSquare className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold">Comments</h3>
                          </div>

                          <div className="space-y-4">
                            {comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{comment.author}</span>
                                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 flex gap-2">
                            <Textarea
                              placeholder="Write a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="flex-1"
                            />
                            <div className="flex flex-col gap-2">
                              <Button size="icon" variant="outline">
                                <Smile className="h-4 w-4" />
                              </Button>
                              <Button size="icon" className="bg-[#0056d2]">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="answered-form" className="mt-6 space-y-8">
                        <AnsweredForm applicant={currentApplicant} />
                      </TabsContent>

                      <TabsContent value="document" className="mt-6 space-y-4">
                        <div className="space-y-4">
                          {/* Document 1 */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="rounded bg-red-100 p-2">
                                <span className="text-xs font-bold text-red-600">PDF</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {currentApplicant.name.replace(/\s+/g, "_")}_Resume.pdf
                                </h4>
                                <p className="text-sm text-gray-500">Uploaded on Dec 15, 2023 at 2:30 PM</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Document 2 */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="rounded bg-blue-100 p-2">
                                <span className="text-xs font-bold text-blue-600">DOC</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Cover_Letter_{currentApplicant.name.replace(/\s+/g, "_")}.docx
                                </h4>
                                <p className="text-sm text-gray-500">Uploaded on Dec 14, 2023 at 4:15 PM</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Document 3 */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="rounded bg-green-100 p-2">
                                <span className="text-xs font-bold text-green-600">IMG</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Profile_Photo_{currentApplicant.name.replace(/\s+/g, "_")}_2x2.jpg
                                </h4>
                                <p className="text-sm text-gray-500">Uploaded on Dec 13, 2023 at 10:45 AM</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Document 4 */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="rounded bg-purple-100 p-2">
                                <span className="text-xs font-bold text-purple-600">PDF</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Medical_Certificate_{currentApplicant.name.replace(/\s+/g, "_")}_2023.pdf
                                </h4>
                                <p className="text-sm text-gray-500">Uploaded on Dec 12, 2023 at 9:20 AM</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Upload New Document */}
                        <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                          <input type="file" multiple className="hidden" id="document-upload" />
                          <div className="space-y-2">
                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <Upload className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <label
                                htmlFor="document-upload"
                                className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                              >
                                Click to upload
                              </label>
                              <span className="text-sm text-gray-500"> or drag and drop</span>
                            </div>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel (40%) */}
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Interview Evaluation Form</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/job/list/applicants/${name || "john-doe"}/IEForm`)}
                        className="flex items-center gap-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Scaling className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Assessments */}
                    {assessments.map((assessment, index) => (
                      <div key={index} className="space-y-3 rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{assessment.name}</h4>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-lg font-bold ${
                                assessment.score < 75
                                  ? "text-red-500"
                                  : assessment.score === 75
                                    ? "text-yellow-500"
                                    : "text-green-500"
                              }`}
                            >
                              {assessment.score}%
                            </span>
                            <RadialChart score={assessment.score} />
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{assessment.description}</p>
                      </div>
                    ))}

                    {/* AI Evaluation Summary */}
                    <div className="space-y-2">
                      <h4 className="font-semibold">AI Evaluation Summary</h4>
                      <Textarea
                        readOnly
                        value="The candidate demonstrates strong technical capabilities with excellent problem-solving skills. Communication skills are above average, and there's good alignment with company values. Recommended for next round."
                        className="h-20 text-sm"
                      />
                    </div>

                    {/* Overall Rating */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Overall Rating</h4>
                      <div className="flex justify-center">
                        <HalfCircleChart score={overallScore} />
                      </div>

                      <Button className="w-full bg-[#0056d2]">Set Interview</Button>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        >
                          Pass
                        </Button>
                        <Button variant="outline" className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100">
                          Fail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
