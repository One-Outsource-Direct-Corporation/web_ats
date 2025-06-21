// JobStageTemplate.tsx
import { useParams, useLocation } from "react-router-dom"
import ResumeScreening from "@/pages/applicants/ResumeScreening"
import PhoneCall from "@/pages/applicants/PhoneInterview"
import Shortlisted from "@/pages/applicants/Shortlisted"
import InitialInterview from "@/pages/InitialInterview"
import Assessment from "@/pages/Assessment"
import FinalInterview from "@/pages/FinalInterview"
import ForJobOffer from "@/pages/ForJobOffer"
import WeeklyMonthly from "@/pages/applicants/lead-developer-weekly-monthly"
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
