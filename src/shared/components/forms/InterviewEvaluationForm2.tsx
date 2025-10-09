"use client"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Navbar } from "@/components/reusables/Navbar"
import { useState } from "react"

const applicantsData = {
  "maria-white": {
    name: "Maria White",
    position: "Project Manager",
  },
  "carmen-martinez": {
    name: "Carmen Martinez",
    position: "Social Media Manager",
  },
  "olivia-miller": {
    name: "Olivia Miller",
    position: "Senior UI/UX Designer",
  },
  "jessica-gonzalez": {
    name: "Jessica Gonzalez",
    position: "Lead Developer",
  },
  "rachel-miller": {
    name: "Rachel Miller",
    position: "Lead Developer",
  },
  "nathan-wood": {
    name: "Nathan Wood",
    position: "QA Engineer",
  },
  "sarah-white": {
    name: "Sarah White",
    position: "QA Engineer",
  },
  "michael-taylor": {
    name: "Michael Taylor",
    position: "Operations Manager",
  },
}

const softSkillsData = [
  {
    skill: "Communication",
    rating: 25,
    remarks: "Demonstrates excellent verbal and written communication skills with clear articulation of ideas.",
  },
  {
    skill: "Teamwork",
    rating: 20,
    remarks: "Shows good collaboration abilities but could improve in leading team discussions.",
  },
  {
    skill: "Problem Solving",
    rating: 18,
    remarks: "Adequate problem-solving approach with room for more creative solutions.",
  },
  {
    skill: "Adaptability",
    rating: 10,
    remarks: "Shows basic adaptability but may struggle with rapid changes in work environment.",
  },
]

const technicalSkillsData = [
  {
    skill: "Programming Languages",
    rating: 35,
    remarks: "Strong proficiency in multiple programming languages with excellent coding practices.",
  },
  {
    skill: "System Design",
    rating: 25,
    remarks: "Good understanding of system architecture with solid design principles.",
  },
  {
    skill: "Database Management",
    rating: 8,
    remarks: "Basic database knowledge with limited experience in complex queries.",
  },
  {
    skill: "Testing & Debugging",
    rating: 7,
    remarks: "Fundamental testing skills but needs improvement in comprehensive test coverage.",
  },
]

const coreValuesData = [
  {
    skill: "Integrity",
    rating: 35,
    remarks: "Demonstrates strong ethical standards and honest communication in all interactions.",
  },
  {
    skill: "Innovation",
    rating: 28,
    remarks: "Shows creative thinking and willingness to explore new approaches to challenges.",
  },
  {
    skill: "Customer Focus",
    rating: 17,
    remarks: "Good understanding of customer needs with adequate service orientation.",
  },
  {
    skill: "Continuous Learning",
    rating: 10,
    remarks: "Shows interest in learning but needs more proactive approach to skill development.",
  },
]

export default function InterviewEvaluationForm() {
  const navigate = useNavigate()
  const { name } = useParams()
  const [isSubmitHovered, setIsSubmitHovered] = useState(false)

  type ApplicantKey = keyof typeof applicantsData

  const currentApplicant =
    name && name in applicantsData
      ? applicantsData[name as ApplicantKey]
      : {
          name: "John Doe",
          position: "Software Engineer",
        }

  const getCurrentDate = () => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, "0")
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const year = today.getFullYear()
    return `${day}/${month}/${year}`
  }



  const AssessmentTable = ({
    title,
    description,
    data,
    totalScore,
  }: {
    title: string
    description: string
    data: typeof softSkillsData
    totalScore: number
  }) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Skill</TableHead>
            <TableHead>Rating (Percentage)</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.skill}</TableCell>
              <TableCell>{item.rating}%</TableCell>
              <TableCell className="text-sm">{item.remarks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end">
        <div className="text-right">
          <span className="text-sm font-medium text-gray-700">Total: </span>
          <span
            className={`text-lg font-bold ${
              totalScore < 75 ? "text-red-500" : totalScore === 75 ? "text-yellow-500" : "text-green-500"
            }`}
          >
            {totalScore}%
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 pt-4">
        <div className="mx-auto max-w-6xl space-y-6 mt-20">
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
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-gray-900">Interview Evaluation Form</h1>
              <div className="mt-2 h-1 w-64 bg-blue-500 rounded"></div>
            </div>
          </div>

          <Card>
            <CardContent className="p-8 space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="applicant-name">Applicant Name</Label>
                  <Input id="applicant-name" value={currentApplicant.name} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interview-date">Interview Date</Label>
                  <Input id="interview-date" value={getCurrentDate()} readOnly className="bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="position">Position applying for</Label>
                  <Input id="position" value={currentApplicant.position} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interviewer">Interviewer</Label>
                  <Input id="interviewer" value="Sarah Johnson - Senior HR Manager" readOnly className="bg-gray-50" />
                </div>
              </div>

              {/* Assessment Tables */}
              <div className="space-y-8">
                <AssessmentTable
                  title="Soft Skill Assessment"
                  description="Interpersonal & behavioral attributes"
                  data={softSkillsData}
                  totalScore={73}
                />

                <AssessmentTable
                  title="Technical Skill Assessment"
                  description="Role-specific hard skills and knowledge"
                  data={technicalSkillsData}
                  totalScore={75}
                />

                <AssessmentTable
                  title="Core Values Assessment"
                  description="Alignment with company's culture and values"
                  data={coreValuesData}
                  totalScore={90}
                />
              </div>

              {/* AI Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">AI Summary</h3>
                <div className="relative">
                  <Textarea
                    value={`Based on the comprehensive interview evaluation, ${currentApplicant.name} demonstrates exceptional alignment with our company's core values, scoring 90% in this critical area. Their strong integrity and innovative mindset make them an excellent cultural fit.

In terms of motivation and competence, the candidate shows remarkable technical proficiency with a 75% score in technical skills, particularly excelling in programming languages and system design. Their communication skills are outstanding (40% of soft skills assessment), enabling them to articulate complex technical concepts clearly.

Key strengths include:
• Excellent verbal and written communication abilities
• Strong technical foundation with solid coding practices
• High ethical standards and integrity
• Creative problem-solving approach
• Good collaboration and teamwork skills

Areas for development:
• Leadership in team discussions
• Adaptability to rapid environmental changes
• Database management expertise
• Comprehensive testing methodologies

Overall, ${currentApplicant.name} presents as a highly motivated candidate with strong technical competencies and excellent cultural alignment. Their communication skills and integrity make them well-suited for collaborative technical roles. Recommendation: Proceed to final interview round.`}
                    className="min-h-[200px] pr-20"
                    readOnly
                  />
                  <div className="absolute bottom-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-blue-600 hover:bg-blue-50"
                    >
                      Ask AI
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  className={`px-8 py-2 border-2 border-blue-500 transition-all duration-200 ${
                    isSubmitHovered
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
                  }`}
                  onMouseEnter={() => setIsSubmitHovered(true)}
                  onMouseLeave={() => setIsSubmitHovered(false)}
                  variant="outline"
                >
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
