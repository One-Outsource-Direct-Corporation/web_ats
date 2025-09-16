import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router";
import "@/App.css";
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { Navbar } from "@/components/reusables/Navbar"
// import Login from "@/pages/Login.tsx"
// import Page from "@/app/DashboardCall"
// import Applicants from '@/pages/applicants/Applicants'
// import Positions from '@/pages/positions/Positions'
// import Library from '@/pages/library/Library'
// import Requests from '@/pages/requests/Requests'

// import JobDetails from '@/pages/applicants/Job'
// import LeadDeveloper from '@/pages/applicants/JobDetails'

// import ApplicantInformationTab from '@/pages/applicants/ApplicantsInformationTab'

// import InterviewEvaluationForm from '@/pages/applicants/InterviewEvaluationFormPage'

// import JobStageTemplate from '@/pages/applicants/JobStateTemplate'
// import CreateNewPosition from '@/pages/requests/create-new-position'
// import IEForm2 from '@/components/forms/InterviewEvaluationForm2'
// import CustomStages from '@/pages/applicants/CustomStages'
// import ExamForm from '@/pages/Exam-Form.tsx'

// import ApplicantMainPage from '@/pages/applicantview/ApplicantMainPage'

// import PRF from '@/pages/positions/PRF'
// import PoolApplicants from '@/pages/applicants/PoolApplicants'
// import { FullExamResultPage } from './pages/FullExamResultPage.tsx'

export default function App() {
  return <RouterProvider router={router} />;
}

{
  /*<Route path="/navbartest" element={<Navbar />} />*/
}
// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//       <Route path="/" element={<Login />} />
//
//       {/* Main Tabs */}
//       <Route path="/dashboard/*" element={<Page />} />
//       <Route path="/job/list/applicants/" element={<Applicants />} />
//       <Route path="/positions/*" element={<Positions />} />
//       <Route path="/library/*" element={<Library />} />
//       <Route path="/requests/*" element={<Requests />} />
//
//       {/* Applicants */}
//       <Route path="/job" element={<JobDetails />} />
//       <Route path="/job/:jobtitle" element={<LeadDeveloper />} />
//       <Route path="/ApplicantInformation/" element={<ApplicantInformationTab />} />
//       <Route path="/ieform/*" element={<InterviewEvaluationForm/>} />
//       <Route path="/job/list/applicants/:name/IEForm" element ={<IEForm2/>} />
//       <Route path="/job/list/applicants/:id/IEForm" element={<IEForm2 />} />
//       <Route path="/job/:jobtitle/:jobstage" element={<JobStageTemplate />} />
//       <Route path="/job/list/applicants/:name" element={<ApplicantInformationTab />} />
//       <Route path="/job/stage/:customStage" element={<CustomStages />} />
//       <Route path="/job/:jobtitle/exam-form/:applicantId" element={<ExamForm />} />
//       <Route path="/job/list/applicants/pool"  element={<PoolApplicants/>} />
//       <Route path="/job/:jobtitle/applicant/:applicantId/full-result" element={<FullExamResultPage />} />
//
//       {/* Applicant View */}
//       <Route path="/applicantlandingpage"  element={<ApplicantMainPage/>} />
//
//       {/* Requests */}
//       <Route path="/positions/create-new-position" element={ < CreateNewPosition />} />
//
//       {/* Positions */}
//       <Route path="/prf"  element={<PRF/>} />
//
//
//
//       </Routes>
//     </BrowserRouter>
//   );
// }
