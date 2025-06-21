"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LayoutGrid, List } from "lucide-react"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { Navbar } from "@/reusables/Navbar"

export default function LeadDeveloper() {
  const navigate = useNavigate()
  const location = useLocation()
  const { jobtitle } = useParams<{ jobtitle: string }>()

  const [currentJobTitle, setCurrentJobTitle] = useState<string>("")
  const [jobData, setJobData] = useState<any>(null)
  const [selectedStage, setSelectedStage] = useState<string>("")

  // Format job title from slug
  const formatJobTitle = (slug: string) => {
    const titleMap: { [key: string]: string } = {
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
    return titleMap[slug.toLowerCase()] || slug.replace(/([A-Z])/g, " $1").trim()
  }

  useEffect(() => {
    if (location.state?.jobTitle) {
      setCurrentJobTitle(location.state.jobTitle)
      setJobData(location.state.jobData)
    } else if (jobtitle) {
      setCurrentJobTitle(formatJobTitle(jobtitle))
    }
  }, [location.state, jobtitle])

  const handleStageClick = (stageName: string) => {
    setSelectedStage(stageName)

    const jobSlug = currentJobTitle.toLowerCase().replace(/\s+/g, "")
    const stageSlug = stageName.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")

    navigate(`/applicants/job/${jobSlug}/${stageSlug}`, {
      state: {
        jobTitle: currentJobTitle,
        stageName,
        jobData,
      },
    })
  }

  useEffect(() => {
    document.title = `Applicants - ${currentJobTitle || "Job Details"}`
  }, [currentJobTitle])

  const stages = [
    {
      title: "STAGE 01 - HR Interview",
      steps: ["Resume Screening", "Phone Call Interview", "Shortlisted"],
    },
    {
      title: "STAGE 02 - Hiring Manager/Client",
      steps: ["Initial Interview", "Assessments", "Final Interview"],
    },
    {
      title: "STAGE 03 - Final Stage",
      steps: ["For Job Offer", "For Offer and Finalization", "Onboarding", "Warm", "Failed"],
    },
  ]

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 p-6 pt-[100px]">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="w-full space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate(`/applicants/job/`)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-3xl font-bold text-gray-800">{currentJobTitle || "Job Details"}</h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  navigate(`/applicants/job/${currentJobTitle?.toLowerCase().replace(/\s+/g, "")}/weekly`, {
                    state: { jobTitle: currentJobTitle, jobData },
                  })
                }
              >
                <LayoutGrid className="text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon">
                <List className="text-blue-800" />
              </Button>
            </div>
          </div>

          {/* Job Info Display */}
          {jobData && (
            <div className="bg-white border rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Candidates:</span>
                  <span className="ml-2 font-semibold">{jobData.candidates}</span>
                </div>
                <div>
                  <span className="text-gray-500">Vacancies:</span>
                  <span className="ml-2 font-semibold">{jobData.vacancies}</span>
                </div>
                <div>
                  <span className="text-gray-500">Department:</span>
                  <span className="ml-2 font-semibold">{jobData.department}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className="ml-2 font-semibold">{jobData.status}</span>
                </div>
              </div>
            </div>
          )}

          {/* Selected Stage Display */}
          {selectedStage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                Last selected stage: <span className="font-semibold">{selectedStage}</span>
              </p>
            </div>
          )}

          {/* Search */}
          <div>
            <Input placeholder="Search" className="max-w-md bg-gray-100" />
          </div>

          <hr />

          {/* Stages */}
          <div className="space-y-10">
            {stages.map((stage) => (
              <div key={stage.title} className="space-y-4">
                <h2 className="text-md font-semibold text-gray-800">{stage.title}</h2>
                <div className="border rounded-md divide-y">
                  {stage.steps.map((step, index) => (
                    <div key={index} className="flex justify-between items-center px-4 py-3 hover:bg-gray-50">
                      <span>{step}</span>
                      <Button
                        variant="link"
                        className="text-blue-600 text-sm px-0 hover:underline"
                        onClick={() => handleStageClick(step)}
                      >
                        View Applicants
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
