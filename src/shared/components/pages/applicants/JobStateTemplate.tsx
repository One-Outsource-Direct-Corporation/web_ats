// JobStageTemplate.tsx
import { useParams, useLocation } from "react-router-dom"
import ResumeScreening from "@/components/pages/applicants/ResumeScreening"
import PhoneCall from "@/components/pages/applicants/PhoneInterview"
import Shortlisted from "@/components/pages/applicants/Shortlisted"
import InitialInterview from "@/components/pages/applicants/InitialInterview"
import Assessment from "@/components/pages/applicants/Assessment"
import FinalInterview from "@/components/pages/applicants/FinalInterview"
import ForJobOffer from "@/components/pages/applicants/ForJobOffer"
import WeeklyMonthly from "@/components/pages/applicants/lead-developer-weekly-monthly"
// import other stages as needed

const STAGE_COMPONENTS: Record<string, React.FC<{ jobTitle?: string; stageName?: string }>> = {
  resumescreening: ResumeScreening,
  phonecallinterview: PhoneCall,
  initialinterview: InitialInterview,
  shortlisted: Shortlisted,
  assessments: Assessment,
  finalinterview: FinalInterview,
  forjoboffer: ForJobOffer,
  weekly: WeeklyMonthly
  // add others
}

export default function JobStageTemplate() {
  const { jobtitle, jobstage } = useParams()
  const location = useLocation()

  const stageKey = (jobstage || "").toLowerCase().replace(/\s+/g, "")
  const Component = STAGE_COMPONENTS[stageKey]

  const state = location.state as { jobTitle?: string; stageName?: string; jobData?: any }

  if (!Component) {
    return <div className="p-6">Stage not found for: {jobstage}</div>
  }

  return <Component jobTitle={state?.jobTitle || jobtitle} stageName={state?.stageName || jobstage} />
}
