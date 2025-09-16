// JobStageTemplate.tsx
import { useParams, useLocation } from "react-router-dom"
import ResumeScreening from "@/pages/applicants/ResumeScreening.tsx"
import PhoneCall from "@/pages/applicants/PhoneInterview.tsx"
import Shortlisted from "@/pages/applicants/Shortlisted.tsx"
import InitialInterview from "@/pages/applicants/InitialInterview.tsx"
import Assessment from "@/pages/applicants/Assessment.tsx"
import FinalInterview from "@/pages/applicants/FinalInterview.tsx"
import ForJobOffer from "@/pages/applicants/ForJobOffer.tsx"
import WeeklyMonthly from "@/pages/applicants/lead-developer-weekly-monthly.tsx"
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
