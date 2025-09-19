"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  FileCode2,
  SquareActivity,
  ShieldCheck,
  FileLineChartIcon as FileChartLine,
  MapPinned,
  FolderIcon as FolderCode,
  Phone,
  Mail,
  Linkedin,
  Cake,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button" // Corrected import syntax
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DocumentUploadModal } from "@/assets/components/document-upload-modal"
import SignaturePad from "@/components/ui/signaturepad"
import { useAppNavigation } from "@/hooks/use-navigation"

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
  fromApplication?: boolean; // Added fromApplication property
}

interface FormData {
  firstName: string
  lastName: string
  birthday: string
  gender: string
  primaryContact: string
  secondaryContact: string
  email: string
  linkedinProfile: string
  addressLine1: string
  city: string
  district: string
  postalCode: string
  country: string
}

export default function JobApplicationPage() {
  const navigation = useAppNavigation()
  const [jobData, setJobData] = useState<JobData | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(true)
  const [currentStage, setCurrentStage] = useState(1)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    birthday: "",
    gender: "",
    primaryContact: "",
    secondaryContact: "",
    email: "",
    linkedinProfile: "",
    addressLine1: "",
    city: "",
    district: "",
    postalCode: "",
    country: "",
  })

  const [stage2Data, setStage2Data] = useState({
    positionApplyingFor: "",
    expectedSalary: "",
    willingToWorkOnsite: "",
    photo: null as File | null,
    medicalCertificate: null as File | null,
    interviewSchedule: "",
  })

  const [stage3Data, setStage3Data] = useState({
    highestEducation: "",
    yearGraduated: "",
    institution: "",
    program: "",
    hasWorkExperience: "",
    currentJobTitle: "",
    currentCompany: "",
    currentYearsExperience: "",
    workExperience: [] as Array<{ jobTitle: string; company: string; years: string }>,
  })

  const [stage4Data, setStage4Data] = useState({
    howDidYouLearn: "",
    certificationAccepted: false,
    signature: null as string | File | null,
  })

  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [trackingCode, setTrackingCode] = useState("")

  // useRef to hold the latest form data for saving, preventing stale closures
  const formStateRef = useRef({
    formData,
    stage2Data,
    stage3Data,
    stage4Data,
    currentStage,
    acceptTerms,
  });

  // Update the ref whenever any of the form states change
  useEffect(() => {
    formStateRef.current = {
      formData,
      stage2Data,
      stage3Data,
      stage4Data,
      currentStage,
      acceptTerms,
    };
  }, [formData, stage2Data, stage3Data, stage4Data, currentStage, acceptTerms]);


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

  // Effect to load job data and persisted form data
  useEffect(() => {
    const currentJob = navigation.getCurrentJob()
    if (currentJob) {
      const parsedJob = currentJob
      parsedJob.icon = getIconComponent(parsedJob.title)
      setJobData(parsedJob)
    }

    // Load persisted form data from localStorage
    try {
      const persistedData = localStorage.getItem('applicationFormData');
      if (persistedData) {
        const parsedData = JSON.parse(persistedData);
        // Restore state, using default values if a specific piece of data is missing
        setFormData(parsedData.formData || formData);
        setStage2Data(parsedData.stage2Data || stage2Data);
        setStage3Data(parsedData.stage3Data || stage3Data);
        setStage4Data(parsedData.stage4Data || stage4Data);
        setCurrentStage(parsedData.currentStage || 1);
        setAcceptTerms(parsedData.acceptTerms || false);

        // If data is loaded, it means the user was likely returning to an ongoing application,
        // so we should not show the upload modal again.
        setShowUploadModal(false);

        // Clear the stored data after loading to prevent stale data on subsequent *new* applications
        // or if the user refreshes the page after completing the application.
        localStorage.removeItem('applicationFormData');
      }
    } catch (error) {
      console.error("Failed to load application form data from localStorage:", error);
      localStorage.removeItem('applicationFormData'); // Clear corrupted data
    }
  }, []); // Empty dependency array to run only once on mount

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (showUploadModal || showCompletionModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showUploadModal, showCompletionModal])

  const handleDocumentsUploaded = (resumeData: any) => {
    // Auto-fill form with resume data
    if (resumeData) {
      setFormData({
        firstName: resumeData.firstName || "John",
        lastName: resumeData.lastName || "Doe",
        birthday: resumeData.birthday || "15-Jan-1990",
        gender: resumeData.gender || "male",
        primaryContact: resumeData.primaryContact || "+63 912 345 6789",
        secondaryContact: resumeData.secondaryContact || "+63 987 654 3210",
        email: resumeData.email || "john.doe@email.com",
        linkedinProfile: resumeData.linkedinProfile || "[https://linkedin.com/in/johndoe](https://linkedin.com/in/johndoe)",
        addressLine1: resumeData.addressLine1 || "123 Main Street, Barangay San Antonio",
        city: resumeData.city || "Makati City",
        district: resumeData.district || "Metro Manila",
        postalCode: resumeData.postalCode || "1203",
        country: resumeData.country || "Philippines",
      })

      // Auto-fill stage 2 data
      setStage2Data((prev) => ({
        ...prev,
        positionApplyingFor: jobData?.title || "",
      }))

      // Auto-fill stage 3 work experience from resume
      setStage3Data((prev) => ({
        ...prev,
        workExperience: [
          { jobTitle: "Software Developer", company: "Tech Solutions Inc.", years: "3" },
          { jobTitle: "Junior Developer", company: "StartUp Co.", years: "2" },
        ],
      }))
    }
    setShowUploadModal(false)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStage2Change = (field: string, value: string | File | null) => {
    setStage2Data((prev) => ({ ...prev, [field]: value }))
  }

  const handleStage3Change = (field: string, value: string) => {
    setStage3Data((prev) => ({ ...prev, [field]: value }))
  }

  const handleStage4Change = (field: string, value: string | boolean | File | null) => {
    setStage4Data((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddWorkExperience = () => {
    if (stage3Data.currentJobTitle && stage3Data.currentCompany && stage3Data.currentYearsExperience) {
      setStage3Data((prev) => ({
        ...prev,
        workExperience: [
          ...prev.workExperience,
          {
            jobTitle: prev.currentJobTitle,
            company: prev.currentCompany,
            years: prev.currentYearsExperience,
          },
        ],
        currentJobTitle: "",
        currentCompany: "",
        currentYearsExperience: "",
      }))
    }
  }

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1)
    }
  }

  const handleNext = () => {
    if (currentStage < 4) {
      setCurrentStage(currentStage + 1)
    } else {
      // Generate tracking code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      setTrackingCode(code)
      setShowCompletionModal(true)
      // Clear local storage on successful submission to prevent re-loading old data
      localStorage.removeItem('applicationFormData');
    }
  }

  const handleBackToHome = () => {
    navigation.goToJobOpenings()
  }

  const handleTrackApplication = () => {
    navigation.goToTracker()
  }

  // Modified handleBackToJobDescription to save current form state to localStorage
  const handleBackToJobDescription = useCallback(() => {
    if (jobData) {
      try {
        // Save all current form states to localStorage using the ref for latest values
        const dataToPersist = formStateRef.current;
        localStorage.setItem('applicationFormData', JSON.stringify(dataToPersist));
        // Pass a flag to indicate navigation from application process
        navigation.goToJobDescription({ ...jobData, fromApplication: true });
      } catch (error) {
        console.error("Failed to save application form data to localStorage:", error);
        // Still navigate even if saving fails
        navigation.goToJobDescription({ ...jobData, fromApplication: true });
      }
    }
  }, [jobData, navigation]); // Dependencies ensure the function is recreated if jobData or navigation changes

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
    // Main container now has min-h-screen to ensure it takes full viewport height
    // It uses flex-row for desktop layout to place sidebar and main content side-by-side.
    <div className="bg-gray-50 flex flex-col lg:flex-row min-h-screen">

      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-900/65 flex items-center justify-center z-50 p-4">
          <div className="max-h-[90vh] overflow-y-auto">
            <DocumentUploadModal
              onClose={() => setShowUploadModal(false)}
              onDocumentsUploaded={handleDocumentsUploaded}
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation Bar (Sticky to viewport) */}
      {/* This will stick to the top of the viewport on small screens */}
      <div className="lg:hidden sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 p-4 w-full">
        <div className="flex items-center justify-between mb-4">
          {/* Logo - Made clickable for mobile */}
          <img src="/OODC logo2.png" alt="OODC Logo" className="h-12 cursor-pointer" onClick={handleLogoClick} />
          <div className="flex items-center gap-2">
            <IconComponent className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">{jobData.title}</span>
          </div>
        </div>

        {/* Mobile Progress Steps - Vertical Layout */}
        <div className="space-y-3">
          {[
            { step: 1, title: "Applicant Information" },
            { step: 2, title: "Job Details" },
            { step: 3, title: "Work and Education" },
            { step: 4, title: "Acknowledgement" },
          ].map(({ step, title }) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                  currentStage >= step
                    ? "bg-blue-600 text-white"
                    : currentStage === step
                      ? "border-2 border-blue-600 bg-white text-blue-600"
                      : "border-2 border-gray-300 text-gray-400"
                }`}
              >
                {currentStage > step ? "✓" : step}
              </div>
              <span className={`text-sm ${currentStage >= step ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                {title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar (Sticky to viewport) */}
      {/* This sidebar will stick to the top left of the viewport and scroll its own content if needed. */}
      <div className="hidden lg:flex w-80 bg-white shadow-lg p-6 flex-col sticky top-0 h-screen overflow-y-auto">
        {/* Logo - Made clickable for desktop */}
        <div className="mb-8 cursor-pointer" onClick={handleLogoClick}>
          <img src="/OODC logo2.png" alt="OODC Logo" className="h-16 mx-auto" />
        </div>

        {/* Progress Steps */}
        <div className="flex-1">
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStage >= 1 ? "bg-blue-600 text-white" : "border-2 border-gray-300 text-gray-400"
                }`}
              >
                {currentStage >= 1 ? "1" : ""}
              </div>
              <span className={`text-sm ${currentStage >= 1 ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                Applicant Information
              </span>
            </div>
            <div className="ml-4 w-0.5 h-8 bg-gray-200"></div>

            {/* Step 2 */}
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStage >= 2 ? "bg-blue-600 text-white" : "border-2 border-blue-600"
                }`}
              >
                {currentStage >= 2 ? "2" : <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
              </div>
              <span className={`text-sm ${currentStage >= 2 ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                Job Details
              </span>
            </div>
            <div className="ml-4 w-0.5 h-8 bg-gray-200"></div>

            {/* Step 3 */}
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStage >= 3 ? "bg-blue-600 text-white" : "border-2 border-gray-300"
                }`}
              >
                {currentStage >= 3 ? "3" : <div className="w-2 h-2 bg-gray-300 rounded-full"></div>}
              </div>
              <span className={`text-sm ${currentStage >= 3 ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                Work and Education
              </span>
            </div>
            <div className="ml-4 w-0.5 h-8 bg-gray-200"></div>

            {/* Step 4 */}
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStage >= 4 ? "bg-blue-600 text-white" : "border-2 border-gray-300"
                }`}
              >
                {currentStage >= 4 ? "4" : <div className="w-2 h-2 bg-gray-300 rounded-full"></div>}
              </div>
              <span className={`text-sm ${currentStage >= 4 ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                Acknowledgement
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area (flex-1 to take remaining horizontal space, and becomes the scrollable container) */}
      {/* This div will now handle its own scrolling for the header and form content. */}
      <div className="flex-1 flex flex-col overflow-y-auto h-screen pb-20"> {/* Added pb-20 */}

        {/* Desktop Header (Sticky within this scrollable area) */}
        {/* This header will stick to the top of its parent's (the main content area's) scrollable region. */}
        <header className="hidden lg:block bg-white shadow-sm p-6 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconComponent className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <h1 className="text-xl font-bold text-gray-900">{jobData.title}</h1>
            </div>
            <Button
              variant="outline"
              onClick={handleBackToJobDescription}
              className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
            >
              View Job Description
            </Button>
          </div>
        </header>

        {/* Form Content (flex-1 to take remaining vertical space within the scrollable main content area) */}
        <div className="flex-1 p-4 lg:p-8">
          {currentStage === 1 && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Data Privacy Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-gray-900">Data Privacy</h2>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  I agree to provide my personal information regarding my application. I understand that it will only be
                  used for this purpose. For more information, you may visit{" "}
                  <a href="[https://oodc.com.ph/privacy-policy/](https://oodc.com.ph/privacy-policy/)" className="text-blue-600 hover:underline">
                    [https://oodc.com.ph/privacy-policy/](https://oodc.com.ph/privacy-policy/)
                  </a>
                  .
                </p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-700 flex items-center">
                    I accept the terms and conditions
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-blue-600">Personal Information</h2>
                  <div className="flex-1 h-px bg-blue-600"></div>
                </div>

                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Birthday */}
                  <div className="max-w-md">
                    <Label htmlFor="birthday" className="text-sm font-medium text-gray-700">
                      Birthday
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="birthday"
                        placeholder="DD-MMM-YYYY"
                        value={formData.birthday}
                        onChange={(e) => handleInputChange("birthday", e.target.value)}
                        className="pl-10"
                      />
                      <Cake className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange("gender", value)}
                      className="flex flex-wrap gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                        <Label htmlFor="prefer-not-to-say">I prefer not to say</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-blue-600">Contact Information</h2>
                  <div className="flex-1 h-px bg-blue-600"></div>
                </div>

                <div className="space-y-6">
                  {/* Contact Numbers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryContact" className="text-sm font-medium text-gray-700">
                        Primary Contact Number
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="primaryContact"
                          value={formData.primaryContact}
                          onChange={(e) => handleInputChange("primaryContact", e.target.value)}
                          className="pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondaryContact" className="text-sm font-medium text-gray-700">
                        Secondary Contact Number
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="secondaryContact"
                          value={formData.secondaryContact}
                          onChange={(e) => handleInputChange("secondaryContact", e.target.value)}
                          className="pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="max-w-md">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* LinkedIn Profile */}
                  <div>
                    <Label htmlFor="linkedinProfile" className="text-sm font-medium text-gray-700">
                      LinkedIn Profile Link
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="linkedinProfile"
                        value={formData.linkedinProfile}
                        onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                        className="pl-10"
                      />
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-blue-600">Address Information</h2>
                  <div className="flex-1 h-px bg-blue-600"></div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-bold text-gray-900 mb-3 block">Address</Label>

                    {/* Address Line 1 */}
                    <div className="mb-4">
                      <Input
                        value={formData.addressLine1}
                        onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                        className="w-full"
                      />
                      <Label className="text-xs text-gray-500 mt-1 block">Address Line 1</Label>
                    </div>

                    {/* City and District */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Input value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                        <Label className="text-xs text-gray-500 mt-1 block">City</Label>
                      </div>
                      <div>
                        <Input
                          value={formData.district}
                          onChange={(e) => handleInputChange("district", e.target.value)}
                        />
                        <Label className="text-xs text-gray-500 mt-1 block">District</Label>
                      </div>
                    </div>

                    {/* Postal Code and Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        />
                        <Label className="text-xs text-gray-500 mt-1 block">Postal Code</Label>
                      </div>
                      <div>
                        <Input
                          value={formData.country}
                          onChange={(e) => handleInputChange("country", e.target.value)}
                        />
                        <Label className="text-xs text-gray-500 mt-1 block">Country</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 2 - Job Details */}
          {currentStage === 2 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  {/* Position Applying For */}
                  <div>
                    <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                      Position Applying For
                    </Label>
                    <Input id="position" value={jobData?.title || ""} readOnly className="mt-1 bg-gray-50" />
                  </div>

                  {/* Expected Salary */}
                  <div>
                    <Label htmlFor="salary" className="text-sm font-medium text-gray-700">
                      Expected Salary (PHP)
                    </Label>
                    <Input
                      id="salary"
                      placeholder="e.g., 50,000"
                      value={stage2Data.expectedSalary}
                      onChange={(e) => handleStage2Change("expectedSalary", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Willing to work onsite */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Are you willing to work onsite?
                    </Label>
                    <RadioGroup
                      value={stage2Data.willingToWorkOnsite}
                      onValueChange={(value) => handleStage2Change("willingToWorkOnsite", value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="onsite-yes" />
                        <Label htmlFor="onsite-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="onsite-no" />
                        <Label htmlFor="onsite-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flexible" id="onsite-flexible" />
                        <Label htmlFor="onsite-flexible">Flexible</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Upload 2x2 Photo */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Upload Recent 2x2 Photo</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleStage2Change("photo", e.target.files?.[0] || null)}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-600">
                          {stage2Data.photo ? stage2Data.photo.name : "Click to upload photo"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Upload Medical Certificate */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Upload Medical Certificate (from the last 6 months)
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(e) => handleStage2Change("medicalCertificate", e.target.files?.[0] || null)}
                        className="hidden"
                        id="medical-upload"
                      />
                      <label htmlFor="medical-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-600">
                          {stage2Data.medicalCertificate
                            ? stage2Data.medicalCertificate.name
                            : "Click to upload certificate"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Interview Schedule */}
                  <div>
                    <Label htmlFor="interview-schedule" className="text-sm font-medium text-gray-700">
                      Preferred Interview Schedule (3 dates, e.g., February 20)
                    </Label>
                    <Input
                      id="interview-schedule"
                      placeholder="e.g., February 20, February 22, February 25"
                      value={stage2Data.interviewSchedule}
                      onChange={(e) => handleStage2Change("interviewSchedule", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 3 - Work and Education */}
          {currentStage === 3 && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Educational Background */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-blue-600">Educational Background</h2>
                  <div className="flex-1 h-px bg-blue-600"></div>
                </div>

                <div className="space-y-6">
                  {/* Education Level and Year */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="education-level" className="text-sm font-medium text-gray-700">
                        Highest Educational Attained
                      </Label>
                      <select
                        id="education-level"
                        value={stage3Data.highestEducation}
                        onChange={(e) => handleStage3Change("highestEducation", e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select education level</option>
                        <option value="High School">High School</option>
                        <option value="Associate Degree">Associate Degree</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctorate">Doctorate</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="year-graduated" className="text-sm font-medium text-gray-700">
                        Year Graduated
                      </Label>
                      <Input
                        id="year-graduated"
                        placeholder="e.g., 2020"
                        value={stage3Data.yearGraduated}
                        onChange={(e) => handleStage3Change("yearGraduated", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Institution and Program */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="institution" className="text-sm font-medium text-gray-700">
                        Institution Name
                      </Label>
                      <Input
                        id="institution"
                        value={stage3Data.institution}
                        onChange={(e) => handleStage3Change("institution", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="program" className="text-sm font-medium text-gray-700">
                        Program/Course
                      </Label>
                      <Input
                        id="program"
                        value={stage3Data.program}
                        onChange={(e) => handleStage3Change("program", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-semibold text-blue-600">Work Experience</h2>
                  <div className="flex-1 h-px bg-blue-600"></div>
                </div>

                <div className="space-y-6">
                  {/* Previous Work Experience Question */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Do you have any previous work experience?
                    </Label>
                    <RadioGroup
                      value={stage3Data.hasWorkExperience}
                      onValueChange={(value) => handleStage3Change("hasWorkExperience", value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="work-yes" />
                        <Label htmlFor="work-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="work-no" />
                        <Label htmlFor="work-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Work Experience Form (shown if Yes) */}
                  {stage3Data.hasWorkExperience === "yes" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="job-title" className="text-sm font-medium text-gray-700">
                            Job Title
                          </Label>
                          <Input
                            id="job-title"
                            value={stage3Data.currentJobTitle}
                            onChange={(e) => handleStage3Change("currentJobTitle", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="company-name" className="text-sm font-medium text-gray-700">
                            Company Name
                          </Label>
                          <Input
                            id="company-name"
                            value={stage3Data.currentCompany}
                            onChange={(e) => handleStage3Change("currentCompany", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Label htmlFor="years-experience" className="text-sm font-medium text-gray-700">
                              Years of Experience
                            </Label>
                            <Input
                              id="years-experience"
                              value={stage3Data.currentYearsExperience}
                              onChange={(e) => handleStage3Change("currentYearsExperience", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              onClick={handleAddWorkExperience}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Work Experience Table */}
                      {stage3Data.workExperience.length > 0 && (
                        <div className="mt-6 overflow-x-auto">
                          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                            <thead>
                              <tr className="bg-blue-600 text-white">
                                <th className="px-4 py-3 text-left">Job Title</th>
                                <th className="px-4 py-3 text-left">Company Name</th>
                                <th className="px-4 py-3 text-left">Years of Experience</th>
                              </tr>
                            </thead>
                            <tbody>
                              {stage3Data.workExperience.map((exp, index) => (
                                <tr key={index} className="border-t border-gray-300">
                                  <td className="px-4 py-3 text-gray-900">{exp.jobTitle}</td>
                                  <td className="px-4 py-3 text-gray-900">{exp.company}</td>
                                  <td className="px-4 py-3 text-gray-900">{exp.years}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stage 4 - Acknowledgement */}
          {currentStage === 4 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  {/* Confidentiality Statement */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      All information provided is for application purposes only and will be treated with strict
                      confidentiality in accordance with applicable laws.
                    </p>
                  </div>

                  {/* How did you learn about this job */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      How did you learn about this job opportunity?
                    </Label>
                    <RadioGroup
                      value={stage4Data.howDidYouLearn}
                      onValueChange={(value) => handleStage4Change("howDidYouLearn", value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="jobstreet" id="jobstreet" />
                        <Label htmlFor="jobstreet">JobStreet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="indeed" id="indeed" />
                        <Label htmlFor="indeed">Indeed</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="facebook" id="facebook" />
                        <Label htmlFor="facebook">Facebook</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="referral" id="referral" />
                        <Label htmlFor="referral">Referral</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Certification Checkbox */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="certification"
                      checked={stage4Data.certificationAccepted}
                      onCheckedChange={(checked) => handleStage4Change("certificationAccepted", checked)}
                    />
                    <Label htmlFor="certification" className="text-sm text-gray-700 leading-relaxed">
                      This is to certify that all information provided is accurate to the best of my abilities and
                      knowledge<span className="text-red-500 ml-1">*</span>
                    </Label>
                  </div>

                  {/* Signature Section */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">Signature</Label>

                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Signature Pad */}
                      <div className="flex-1 h-[260px]">
                        <SignaturePad />
                      </div>

                      {/* Upload Signature */}
                      <div className="flex-1 h-[260px]">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-full flex items-center justify-center bg-white w-full max-w-full">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleStage4Change("signature", e.target.files?.[0] || null)}
                            className="hidden"
                            id="signature-upload"
                          />
                          <label htmlFor="signature-upload" className="cursor-pointer">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-600">
                              {stage4Data.signature && typeof stage4Data.signature !== "string"
                                ? (stage4Data.signature as File).name
                                : "Upload signature"}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer for Navigation Buttons */}
      <div className="fixed bottom-0 left-0 lg:left-80 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <div className="max-w-4xl mx-auto flex justify-between">
          {currentStage > 1 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent px-8 py-2"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={
              (currentStage === 1 && !acceptTerms) ||
              (currentStage === 4 && !stage4Data.certificationAccepted)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            {currentStage === 4 ? "Submit Application" : "Next"}
          </Button>
        </div>
      </div>

      {/* Application Complete Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-gray-900/65 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Application Complete!</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Congratulations! Your application is complete! 🎉 A tracking code has been sent to your email. You can use
              this code to easily track your application's progress through the Track Application section. We're excited
              to have you on this journey!
            </p>
            <div className="bg-blue-50 p-3 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-1">Your tracking code:</p>
              <p className="text-lg font-bold text-blue-600">{trackingCode}</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleBackToHome} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Back to Home
              </Button>
              <Button onClick={handleTrackApplication} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Track Application
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
