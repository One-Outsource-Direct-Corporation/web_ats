import { useParams, useLocation } from "react-router-dom";
import ResumeScreening from "../views/ResumeScreening";
import PhoneCall from "../views/PhoneInterview";
import Shortlisted from "../views/Shortlisted";
import InitialInterview from "../views/InitialInterview";
import Assessment from "../views/Assessment";
import FinalInterview from "../views/FinalInterview";
import ForJobOffer from "../views/ForJobOffer";
import WeeklyMonthly from "../views/lead-developer-weekly-monthly";
const STAGE_COMPONENTS: Record<
  string,
  React.FC<{ jobTitle?: string; stageName?: string }>
> = {
  resumescreening: ResumeScreening,
  phonecallinterview: PhoneCall,
  initialinterview: InitialInterview,
  shortlisted: Shortlisted,
  assessments: Assessment,
  finalinterview: FinalInterview,
  forjoboffer: ForJobOffer,
  weekly: WeeklyMonthly,
  // add others
};

export default function JobStageTemplate() {
  const { jobtitle, jobstage } = useParams();
  const location = useLocation();

  const stageKey = (jobstage || "").toLowerCase().replace(/\s+/g, "");
  const Component = STAGE_COMPONENTS[stageKey];

  const state = location.state as {
    jobTitle?: string;
    stageName?: string;
    jobData?: any;
  };

  if (!Component) {
    return <div className="p-6">Stage not found for: {jobstage}</div>;
  }

  return (
    <Component
      jobTitle={state?.jobTitle || jobtitle}
      stageName={state?.stageName || jobstage}
    />
  );
}
