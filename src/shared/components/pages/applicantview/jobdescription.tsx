"use client"

import { useState, useEffect } from "react"
import {
  ArrowUp,
  FileCode2,
  SquareActivity,
  ShieldCheck,
  FileLineChartIcon as FileChartLine,
  MapPinned,
  FolderIcon as FolderCode,
  ArrowLeft, // Import ArrowLeft icon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppNavigation } from "@/hooks/use-navigation"

// Define the JobData interface to include the optional 'fromApplication' property
interface JobData {
  id: number
  title: string
  icon: any
  department: string
  role: string
  description: string
  filters: string[]
  daysAgo: number
  applicants: string
  category: string
  workType: string
  workSetup: string
  fromApplication?: boolean; // Optional property to indicate navigation origin
}

export default function JobDescription() {
  const navigation = useAppNavigation()
  const [jobData, setJobData] = useState<JobData | null>(null)
  const [showReturnButton, setShowReturnButton] = useState(false); // State for conditional rendering

  // Icon mapping function
  const getIconComponent = (jobTitle: string) => {
    const iconMap: { [key: string]: any } = {
      "Lead Developer": FileCode2,
      "Sales Support": SquareActivity,
      "IT Quality Assurance": ShieldCheck,
      "Business Analyst": FileChartLine,
      "Field Inspector": MapPinned,
      "Software Engineer II": FolderCode,
    }
    return iconMap[jobTitle] || FileCode2
  }

  useEffect(() => {
    // Get job data from navigation state
    const currentJob = navigation.getCurrentJob() as JobData; // Cast to JobData
    if (currentJob) {
      // Restore the icon component
      currentJob.icon = getIconComponent(currentJob.title)
      setJobData(currentJob)

      // Check if the navigation came from the application process page
      if (currentJob.fromApplication) {
        setShowReturnButton(true);
      } else {
        setShowReturnButton(false);
      }
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleViewOtherOpenings = () => {
    navigation.goToJobOpenings()
  }

  const handleApplyNow = () => {
    if (jobData) {
      navigation.goToApplicationProcess(jobData)
    }
  }

  // Function to return to application process
  const handleReturnToApplication = () => {
    if (jobData) {
      // When returning, we don't need to pass the "fromApplication" flag again
      // as the application process page doesn't need to know its origin for this flow.
      navigation.goToApplicationProcess(jobData);
    }
  };

  // Function to handle logo click, navigating to job openings
  const handleLogoClick = () => {
    navigation.goToJobOpenings()
  }

  if (!jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Loading job details...</p>
        </div>
      </div>
    )
  }

  const IconComponent = jobData.icon

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-6">
        <div className="max-w-4xl mx-auto">
          {/* Logo - Made clickable */}
          <div className="flex justify-center mb-6 cursor-pointer" onClick={handleLogoClick}>
            <img src="/OODC logo3.png" alt="OODC Logo" className="h-16" />
          </div>

          {/* Job Title with Icon */}
          <div className="flex items-center gap-3 mb-2">
            <IconComponent className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <h1 className="text-2xl font-bold text-gray-900">{jobData.title}</h1>
          </div>

          {/* Department and Role */}
          <div className="text-gray-600 mb-6 ml-9">
            {jobData.department} • {jobData.role}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 ml-9 flex-wrap"> {/* Added flex-wrap for responsiveness */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2" onClick={handleApplyNow}>
              Apply Now
            </Button>
            <Button variant="outline" className="px-6 py-2 bg-transparent" onClick={handleViewOtherOpenings}>
              View Other Opening
            </Button>
            {/* Conditional rendering for Return to Application Button */}
            {showReturnButton && (
              <Button
                variant="outline"
                className="px-6 py-2 bg-transparent flex items-center gap-2"
                onClick={handleReturnToApplication}
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Application
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Filter Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Category</h3>
              <p className="text-gray-600">{jobData.category}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Work Type</h3>
              <p className="text-gray-600">{jobData.workType}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Work Setup</h3>
              <p className="text-gray-600">{jobData.workSetup}</p>
            </div>
          </div>
        </div>

        {/* Job Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-900">Job Summary</h2>
          </div>
          <div className="text-gray-700 leading-relaxed">
            <p className="mb-4">
              The Business Tech team builds and promotes a culture of innovation, forward-thinking and efficiency within
              the organization to enable the business to achieve overall goals and success.
            </p>
            <p className="mb-4">
              The Head of IT Operations leads and governs company-wide systems, ensuring operational excellence and
              makes technical decisions that impact brand and business. S/he demonstrates high-level IT proficiency in
              formulating technology-driven strategies and frameworks to drive short and long-term business results. As
              one of the critical leads in the company's technical offense, s/he serves as one of the primary resource
              persons for technical expertise and defines standards and processes for IT assets, data protection, cyber
              security, and all other matters within the scope of IT. S/he also resolves complex issues that the IT
              Operations Specialist escalates to him / her.
            </p>
            <p className="mb-4">
              The ideal candidate is meticulous and is a multi-tasker, able to lead the team to the best and most
              suitable suppliers who can cater to the needs of the company. S/he displays strong leadership, effectively
              manages team priorities, works well with internal and external parties, can work on various projects
              simultaneously and fosters a culture of integrity within the team.
            </p>
            <p>
              She/he is very passionate about IT and technological advancements, constantly seeking ways to evolve and
              modernize systems and infrastructure of the company.
            </p>
          </div>
        </div>

        {/* Responsibilities */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-900">Responsibilities</h2>
          </div>
          <ul className="text-gray-700 space-y-2">
            <li>• Provides strategic direction by creating short-, mid- and long-term plans for the IT department</li>
            <li>
              • Leads and governs company-wide systems, ensuring operational excellence in servicing the retail,
              e-commerce and social commerce business units as well as internal customers
            </li>
            <li>
              • In charge of proper vendor management to source and purchase IT-related assets, with operations and cost
              optimization in mind
            </li>
            <li>• Forms IT plans, strategies and projects (short-, mid- and long-term)</li>
            <li>
              • Collaborates with cross-functional teams in identifying, maintaining and upgrading departmental systems
            </li>
            <li>• Develops and implements cyber and data security framework and standards across all systems</li>
            <li>• Provides insights and analytics support for better decision-making</li>
            <li>
              • Resolves elevated complex IT tickets and provides agile solutions to IT-related concerns (hardware /
              software /data / processes)
            </li>
            <li>
              • Plans and manages simultaneous projects and priorities, managing schedules and ensuring delivery of
              high-level results
            </li>
            <li>• Oversees and manages IT Operations Specialist's productivity and workload</li>
            <li>• Ensures seamless servers and systems with zero interruptions</li>
            <li>• Creates the IT budget and monitors functional spend</li>
            <li>• Generates reports as needed</li>
            <li>
              • Educates members of the organization on best practices on security and caring for assigned company
              assets
            </li>
            <li>• Contributes insights and solutions to ensure the company's compliance with the Data Privacy Act</li>
            <li>• Able to manage on multiple projects simultaneously</li>
            <li>
              • Keeps abreast on latest technologies, trends, standards, applications and practices and promotes a
              culture of innovation and forward-thinking
            </li>
          </ul>
        </div>

        {/* Qualifications */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-900">Qualifications</h2>
          </div>
          <ul className="text-gray-700 space-y-2">
            <li>• Graduate of a bachelor's degree in Computer Science, Information Technology or any similar course</li>
            <li>
              • Solid experience in Information Technology of at least 8 years and has handled a team of direct reports;
              working in retail or e-commerce companies are advantages
            </li>
            <li>
              • Experience in implementing and managing integrated systems (hardware and software) in multiple locations
            </li>
            <li>• Experience with Enterprise Resource Planning (ERP)</li>
            <li>• Knowledgeable in supporting Mac OS, Windows and Windows Server 2012 and 2019</li>
            <li>• Knowledgeable in Unifi Products</li>
            <li>• Knowledgeable in Google Suite</li>
            <li>• Certifications: CompTIA A+, Microsoft Certified Professional, ITIL V3/V4</li>
            <li>
              • Good written and verbal communication skills to present and educate others on technical concepts and
              projects
            </li>
            <li>• Proven project and vendor management skills and can work well both independently and with teams</li>
          </ul>
        </div>

        {/* Back to Top Button */}
        <div className="flex justify-end mt-8">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={scrollToTop}>
            <ArrowUp className="h-4 w-4" />
            Back To Top
          </Button>
        </div>
      </main>
    </div>
  )
}
