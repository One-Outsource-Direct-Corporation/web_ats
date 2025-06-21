import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from "@/reusables/Navbar"
import Login from "@/pages/Login"
import Page from "@/app/DashboardCall"
import Applicants from '@/pages/applicants/Applicants'
import Positions from '@/pages/positions/Positions'
import Library from '@/pages/Library'
import Requests from '@/pages/Requests'

import JobDetails from '@/pages/applicants/Job'
import LeadDeveloper from '@/pages/applicants/JobDetails'
import LeadDeveloperWeekly from '@/pages/applicants/lead-developer-weekly-monthly'
import ApplicantInformationTab from '@/pages/applicants/ApplicantsInformationTab'
import LeadDeveloperRS from '@/pages/applicants/ResumeScreening'
import LeadDeveloperPI from '@/pages/applicants/PhoneInterview'
import LeadDeveloperSL from '@/pages/applicants/Shortlisted'

import InterviewEvaluationForm from '@/pages/InterviewEvaluationFormPage'

import PositionsPendings from '@/pages/positions/positions-pendings'
import PositionsOnHold from '@/pages/positions/positions-onhold'
import PositionsPublished from '@/pages/positions/positions-published'
import PositionsClosed from '@/pages/positions/positions-closed'
import PositionsArchive from '@/pages/positions/positions-archive'
import LeadDeveloperII from '@/pages/InitialInterview'
import LeadDeveloperAS from '@/pages/Assessment'
import LeadDeveloperFI from '@/pages/FinalInterview'
import LeadDeveloperFJO from '@/pages/ForJobOffer'
import OfferAndFinalization from '@/pages/OfferAndFinalization'
import JobStageTemplate from './pages/applicants/JobStateTemplate'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />} />
      <Route path="/login" element={<Login />} />

      {/* Main Tabs */}
      <Route path="/dashboard/*" element={<Page />} />
      <Route path="/applicants/" element={<Applicants />} />
      <Route path="/positions/*" element={<Positions />} />
      <Route path="/library/*" element={<Library />} />
      <Route path="/requests/*" element={<Requests />} />

      {/* Applicants */}
      <Route path="/applicants/job" element={<JobDetails />} />
      <Route path="/applicants/job/:jobtitle" element={<LeadDeveloper />} />
      <Route path="/applicants/jobdetails/leaddeveloper/leaddeveloperweekly" element={<LeadDeveloperWeekly />} />
      <Route path="/ApplicantInformation/" element={<ApplicantInformationTab />} />
      <Route path="/applicants/jobdetails/leaddeveloper/resumescreening" element={<LeadDeveloperRS />} />
      <Route path="/applicants/jobdetails/leaddeveloper/LeadDeveloperPI" element={<LeadDeveloperPI/>} />
      <Route path="/applicants/jobdetails/leaddeveloper/LeadDeveloperSL" element={<LeadDeveloperSL/>} />

      <Route path="/ieform/*" element={<InterviewEvaluationForm/>} />

      {/* Positions */}
      <Route path="/positions/pendings" element={<PositionsPendings />} />
      <Route path="/positions/on-hold" element={<PositionsOnHold />} />
      <Route path="/positions/published" element={<PositionsPublished />} />
      <Route path="/positions/closed" element={<PositionsClosed />} />
      <Route path="/positions/archive" element={<PositionsArchive />} />
       
      <Route path="/applicants/jobdetails/leaddeveloper/LeadDeveloperII" element={<LeadDeveloperII/>} />
      <Route path="/applicants/jobdetails/leaddeveloper/LeadDeveloperAS" element={<LeadDeveloperAS/>} />
      <Route path="/applicants/jobdetails/leaddeveloper/LeadDeveloperFI" element={<LeadDeveloperFI/>} />
      <Route path="/applicants/jobdetails/leaddeveloper/LeadDeveloperFJO" element={<LeadDeveloperFJO/>} />  
      <Route  path="/applicants/OfferAndFinalization" element={<OfferAndFinalization />} />
      <Route path="/applicants/job/:jobtitle/:jobstage" element={<JobStageTemplate />} />
      <Route path="/applicants/:name" element={<ApplicantInformationTab />} />
      </Routes>
    </BrowserRouter>
  );
}
