"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react" // Import useRef
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/reusables/Navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { User2, Sparkles, Wand2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

// Explicitly define nested types for clarity and robustness
interface AssessmentTypes {
  technical: boolean
  language: boolean
  cognitive: boolean
  personality: boolean
  behavioral: boolean
  cultural: boolean
}

interface HardwareRequired {
  desktop: boolean
  handset: boolean
  headset: boolean
  laptop: boolean
}

interface SoftwareRequired {
  [key: string]: boolean
}

// Type definitions for form data
interface FormData {
  // Step 1 - Position Information
  jobTitle: string
  targetStartDate: string
  numberOfVacancies: string
  reasonForPosting: string
  otherReasonForPosting: string

  // Step 1 - Department Information
  businessUnit: string
  departmentName: string
  interviewLevels: number
  immediateSupervisor: string

  // Step 2 - Job Details
  contractType: string
  workArrangement: string
  category: string
  position: string
  workingSite: string
  workScheduleFrom: string // Updated to store 'from' time
  workScheduleTo: string // Added to store 'to' time

  // Step 2 - Job Description
  jobDescription: string
  responsibilities: string
  qualifications: string
  nonNegotiables: string
  salaryBudget: string
  isSalaryRange: boolean
  minSalary: string
  maxSalary: string

  // Step 3 - Assessments
  assessmentRequired: string
  assessmentTypes: AssessmentTypes
  otherAssessment: string
  hardwareRequired: HardwareRequired
  softwareRequired: SoftwareRequired
}

// Props for InputField
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

// Props for step components
interface StepProps {
  step: number
  formData: FormData
}

interface NavigationProps {
  goToNextStep: () => void
  goToPreviousStep: () => void
  step: number
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
}

interface Step01Props {
  goToNextStep: () => void
  step: number
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
}

interface Step04Props {
  goToPreviousStep: () => void
  step: number
  formData: FormData
  handleSubmit: () => void
}

const InputField = ({ label, ...props }: InputFieldProps) => (
  <div className="w-full">
    <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
    <Input className="w-full" {...props} />
  </div>
)

// Custom Radio Button Component
const CustomRadio = ({
  name,
  value,
  checked,
  onChange,
  children,
  ...props
}: {
  name: string
  value: string
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  children: React.ReactNode
  [key: string]: any
}) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <div className="relative">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      <div
        className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
          checked ? "bg-[#0056D2] border-[#0056D2]" : "bg-white border-gray-300 hover:border-gray-400"
        }`}
      >
        {checked && (
          <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
    </div>
    <span className="text-sm">{children}</span>
  </label>
)

// Custom Checkbox Component
const CustomCheckbox = ({
  checked,
  onChange,
  children,
  ...props
}: {
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  children: React.ReactNode
  [key: string]: any
}) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <div className="relative">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" {...props} />
      <div
        className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${
          checked ? "bg-[#0056D2] border-[#0056D2]" : "bg-white border-gray-300 hover:border-gray-400"
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
    <span className="text-sm">{children}</span>
  </label>
)

// New TimePicker Component
interface TimePickerProps {
  label: string // Used for dialog title
  currentTime: string // Format "HH:MM" (24-hour)
  onChange: (time: string) => void
}

function TimePicker({ label, currentTime, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempHour, setTempHour] = useState(12) // 1-12 for display
  const [tempMinute, setTempMinute] = useState(0)
  const [tempAmPm, setTempAmPm] = useState<"AM" | "PM">("AM")

  const hourRefs = useRef<(HTMLDivElement | null)[]>([])
  const minuteRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (currentTime) {
      const [h, m] = currentTime.split(":").map(Number)
      setTempMinute(m)
      if (h === 0) {
        // 00:XX (12 AM)
        setTempHour(12)
        setTempAmPm("AM")
      } else if (h === 12) {
        // 12:XX (12 PM)
        setTempHour(12)
        setTempAmPm("PM")
      } else if (h > 12) {
        // 13:XX - 23:XX (1 PM - 11 PM)
        setTempHour(h - 12)
        setTempAmPm("PM")
      } else {
        // 01:XX - 11:XX (1 AM - 11 AM)
        setTempHour(h)
        setTempAmPm("AM")
      }
    } else {
      setTempHour(12) // Default to 12
      setTempMinute(0)
      setTempAmPm("AM")
    }
  }, [currentTime])

  useEffect(() => {
    if (isOpen) {
      // Scroll to selected hour and minute when dialog opens
      hourRefs.current[tempHour]?.scrollIntoView({ behavior: "smooth", block: "center" })
      minuteRefs.current[tempMinute]?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isOpen, tempHour, tempMinute])

  const handleSave = () => {
    let finalHour24 = tempHour
    if (tempAmPm === "PM" && tempHour !== 12) {
      finalHour24 += 12
    } else if (tempAmPm === "AM" && tempHour === 12) {
      finalHour24 = 0 // 12 AM is 00 in 24-hour format
    }
    const formattedHour = String(finalHour24).padStart(2, "0")
    const formattedMinute = String(tempMinute).padStart(2, "0")
    onChange(`${formattedHour}:${formattedMinute}`)
    setIsOpen(false)
  }

  const handleCancel = () => {
    if (currentTime) {
      const [h, m] = currentTime.split(":").map(Number)
      setTempMinute(m)
      if (h === 0) {
        setTempHour(12)
        setTempAmPm("AM")
      } else if (h === 12) {
        setTempHour(12)
        setTempAmPm("PM")
      } else if (h > 12) {
        setTempHour(h - 12)
        setTempAmPm("PM")
      } else {
        setTempHour(h)
        setTempAmPm("AM")
      }
    } else {
      setTempHour(12)
      setTempMinute(0)
      setTempAmPm("AM")
    }
    setIsOpen(false)
  }

  const formatTimeForDisplay = (time24: string) => {
    if (!time24) return `Select ${label}`
    const [h, m] = time24.split(":").map(Number)
    const period = h >= 12 ? "PM" : "AM"
    const hour12 = h % 12 === 0 ? 12 : h % 12
    return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`
  }

  const displayValue = formatTimeForDisplay(currentTime)

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full justify-start text-left font-normal text-gray-700 bg-transparent"
        onClick={() => setIsOpen(true)}
        aria-label={`Select ${label} time`}
      >
        {displayValue}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Select {label}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-2">Hour</h3>
              <div className="h-48 overflow-y-auto w-20 border rounded-md p-1 text-center scrollbar-hide">
                {Array.from({ length: 12 }, (_, i) => {
                  const hourValue = i === 0 ? 12 : i // Display 12 for index 0, then 1-11
                  return (
                    <div
                      key={hourValue} // Use hourValue as key
                      ref={(el) => (hourRefs.current[hourValue] = el)}
                      className={`py-1 cursor-pointer rounded-sm ${
                        tempHour === hourValue ? "bg-[#0056D2] text-white" : "hover:bg-gray-100"
                      }`}
                      onClick={() => setTempHour(hourValue)}
                    >
                      {String(hourValue).padStart(2, "0")}
                    </div>
                  )
                })}
              </div>
            </div>
            {/* Minutes */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-2">Minute</h3>
              <div className="h-48 overflow-y-auto w-20 border rounded-md p-1 text-center scrollbar-hide">
                {Array.from({ length: 60 }, (_, i) => (
                  <div
                    key={i}
                    ref={(el) => (minuteRefs.current[i] = el)}
                    className={`py-1 cursor-pointer rounded-sm ${
                      tempMinute === i ? "bg-[#0056D2] text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setTempMinute(i)}
                  >
                    {String(i).padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>
            {/* AM/PM */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-2">AM/PM</h3>
              <div className="h-48 overflow-y-auto w-20 border rounded-md p-1 text-center scrollbar-hide">
                {["AM", "PM"].map((period) => (
                  <div
                    key={period}
                    className={`py-1 cursor-pointer rounded-sm ${
                      tempAmPm === period ? "bg-[#0056D2] text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setTempAmPm(period as "AM" | "PM")}
                  >
                    {period}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Set Time</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PreviewInfo({ step, formData }: StepProps) {
  const [showMore, setShowMore] = useState(false)

  // Get selected assessment types
  const selectedAssessments = Object.entries(formData.assessmentTypes)
    .filter(([, selected]) => selected)
    .map(([type]) => {
      const typeMap: { [key: string]: string } = {
        technical: "Technical Test",
        language: "Language Proficiency Test",
        cognitive: "Cognitive Test",
        personality: "Personality Test",
        behavioral: "Behavioral Test",
        cultural: "Cultural Test",
      }
      return typeMap[type]
    })

  // Get selected hardware
  const selectedHardware = Object.entries(formData.hardwareRequired)
    .filter(([, selected]) => selected)
    .map(([hardware]) => hardware.charAt(0).toUpperCase() + hardware.slice(1))

  // Get selected software
  const selectedSoftware = Object.entries(formData.softwareRequired)
    .filter(([, selected]) => selected)
    .map(([software]) => software)

  const displaySalary = formData.isSalaryRange
    ? `${formData.minSalary || "N/A"} - ${formData.maxSalary || "N/A"}`
    : formData.salaryBudget || "Not specified"

  const displayWorkSchedule =
    formData.workScheduleFrom && formData.workScheduleTo
      ? `${formData.workScheduleFrom} - ${formData.workScheduleTo}`
      : "Not specified"

  return (
    <div className="border rounded-md p-4 bg-white text-sm h-fit sticky top-28 space-y-4">
      {step !== 4 && (
        <>
          {/* POSITION INFORMATION */}
          <div className="space-y-2">
            <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
              POSITION INFORMATION
            </h2>
            <p>
              <strong>Job Title:</strong> {formData.jobTitle || "Not specified"}
            </p>
            <p>
              <strong>Target Start Date:</strong> {formData.targetStartDate || "Not specified"}
            </p>
            <p>
              <strong>Number of Vacancies:</strong> {formData.numberOfVacancies || "Not specified"}
            </p>
            <p>
              <strong>Reason for Posting Position:</strong>{" "}
              {formData.reasonForPosting === "Other"
                ? formData.otherReasonForPosting
                : formData.reasonForPosting || "Not specified"}
            </p>
          </div>
          {/* DEPARTMENT INFORMATION */}
          <div className="space-y-2">
            <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
              DEPARTMENT INFORMATION
            </h2>
            <p>
              <strong>Business Unit:</strong> {formData.businessUnit || "Not specified"}
            </p>
            <p>
              <strong>Levels of Interview:</strong> {formData.interviewLevels}
            </p>
            <p>
              <strong>Department Name:</strong> {formData.departmentName || "Not specified"}
            </p>
            <p>
              <strong>Immediate Supervisor:</strong> {formData.immediateSupervisor || "Not specified"}
            </p>
          </div>
          {step >= 2 && (
            <>
              {/* JOB DETAILS */}
              <div className="space-y-2">
                <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
                  JOB DETAILS
                </h2>
                <p>
                  <strong>Contract Type:</strong> {formData.contractType || "Not specified"}
                </p>
                <p>
                  <strong>Work Arrangement:</strong> {formData.workArrangement || "Not specified"}
                </p>
                <p>
                  <strong>Category:</strong> {formData.category || "Not specified"}
                </p>
                <p>
                  <strong>Subcategory:</strong> {formData.position || "Not specified"}
                </p>
                <p>
                  <strong>Working Site:</strong> {formData.workingSite || "Not specified"}
                </p>
                <p>
                  <strong>Working Schedule:</strong> {displayWorkSchedule}
                </p>
              </div>
              {/* JOB DESCRIPTION */}
              <div className="space-y-2">
                <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
                  JOB DESCRIPTION
                </h2>
                <p>{formData.jobDescription || "Job description not provided yet..."}</p>
              </div>
              {showMore && (
                <>
                  {/* KEY RESPONSIBILITIES */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Key Responsibilities:</h3>
                    <p className="text-sm">{formData.responsibilities || "Responsibilities not specified yet..."}</p>
                  </div>
                  {/* QUALIFICATIONS */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Qualifications:</h3>
                    <p className="text-sm">{formData.qualifications || "Qualifications not specified yet..."}</p>
                  </div>
                  {/* NON-NEGOTIABLES */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Non-Negotiables:</h3>
                    <p className="text-sm">{formData.nonNegotiables || "Non-negotiables not specified yet..."}</p>
                  </div>
                  {/* ASSESSMENTS */}
                  {step === 3 && (
                    <div className="space-y-2">
                      <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
                        ASSESSMENTS
                      </h2>
                      <p>
                        <strong>Assessment Required:</strong> {formData.assessmentRequired}
                      </p>
                      {selectedAssessments.length > 0 && (
                        <ul className="list-disc list-inside space-y-1">
                          {selectedAssessments.map((assessment, index) => (
                            <li key={index}>{assessment}</li>
                          ))}
                          {formData.otherAssessment && <li>{formData.otherAssessment}</li>}
                        </ul>
                      )}
                    </div>
                  )}
                  {/* SALARY BUDGET */}
                  <div className="space-y-2">
                    <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
                      SALARY BUDGET
                    </h2>
                    <p className="font-semibold text-gray-800">{displaySalary}</p>
                  </div>
                  {/* ASSET REQUEST */}
                  <div className="space-y-2">
                    <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
                      ASSET REQUEST
                    </h2>
                    {selectedHardware.length > 0 && (
                      <>
                        <p className="font-semibold text-sm">Hardware Required:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedHardware.map((hardware, index) => (
                            <li key={index}>{hardware}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {selectedSoftware.length > 0 && (
                      <>
                        <p className="font-semibold text-sm mt-2">Software Required:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedSoftware.map((software, index) => (
                            <li key={index}>{software}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {selectedHardware.length === 0 && selectedSoftware.length === 0 && (
                      <p className="text-sm text-gray-500">No hardware or software specified.</p>
                    )}
                  </div>
                </>
              )}
              {/* SHOW MORE TOGGLE */}
              <div className="text-[#0056D2] text-sm mt-2 cursor-pointer" onClick={() => setShowMore(!showMore)}>
                {showMore ? "▲ See less" : "▼ See more"}
              </div>
            </>
          )}
        </>
      )}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">APPROVAL</h2>
          {/* STEP BLOCK */}
          {[1, 2, 3].map((stepNumber, i) => {
            const titles = [
              {
                title: "HR Manager Review",
                subtitle: "Initial review and budget allocation",
                label: "HR Manager",
              },
              {
                title: "Finance Approval",
                subtitle: "Budget verification",
                label: "Finance Manager",
              },
              {
                title: "Final Approval",
                subtitle: "Final approval before position opens",
                label: "General Manager",
              },
            ]
            const isLast = i === 2
            const { title, subtitle, label } = titles[i]
            return (
              <div key={i} className="relative flex gap-4">
                {/* Left Timeline */}
                <div className="flex flex-col items-center w-6">
                  {/* Line */}
                  {!isLast && <div className="absolute top-6 left-[11px] h-full w-px bg-blue-200 z-0" />}
                  {/* Circle */}
                  <div className="relative z-10 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {stepNumber}
                  </div>
                </div>
                {/* Right Content */}
                <div className="border rounded-lg p-4 bg-white shadow space-y-4 flex-1">
                  {/* Header with title & buttons */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{title}</p>
                      <p className="text-xs text-gray-500">{subtitle}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-red-600 bg-red-100 px-3 py-1 text-xs rounded">Reject</button>
                      <button className="text-green-600 bg-green-100 px-3 py-1 text-xs rounded">Approve</button>
                    </div>
                  </div>
                  {/* Approver */}
                  <p className="text-sm text-gray-500">
                    <strong>{label}:</strong> Mr. Carlos Garcia
                  </p>
                  {/* Budget Allocation */}
                  <div>
                    <label className="text-sm font-semibold block mb-1">Budget Allocation</label>
                    <input
                      type="text"
                      value={displaySalary}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-500 bg-white"
                    />
                  </div>
                  {/* Comments */}
                  <div>
                    <label className="text-sm font-semibold block mb-1">Comments</label>
                    <textarea
                      rows={4}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 bg-white resize-none"
                      defaultValue={
                        stepNumber === 1
                          ? "Approved. Please confirm final budget availability with Finance before proceeding with recruitment."
                          : "Add your review comments..."
                      }
                    />
                  </div>
                  {/* Edit Button */}
                  {stepNumber === 1 && (
                    <div>
                      <button className="px-3 py-1 text-xs rounded bg-gray-100 text-blue-600 hover:bg-gray-200">
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Step01({ goToNextStep, step, formData, updateFormData }: Step01Props) {
  const handleInterviewLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove leading zeros and parse as integer
    const value = e.target.value.replace(/^0+/, "")
    const parsedValue = Number.parseInt(value)
    // Ensure value is not negative, default to 0 if NaN (empty string)
    updateFormData({ interviewLevels: Number.isNaN(parsedValue) ? 0 : Math.max(0, parsedValue) })
  }

  const handleReasonForPostingChange = (value: string) => {
    updateFormData({
      reasonForPosting: value,
      otherReasonForPosting: value === "Other" ? "" : formData.otherReasonForPosting,
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Position Information */}
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
            Position Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Job Title"
              placeholder="Enter Job Title"
              value={formData.jobTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ jobTitle: e.target.value })}
            />
            <InputField
              label="Target Start Date"
              type="date"
              value={formData.targetStartDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ targetStartDate: e.target.value })}
            />
            <InputField
              label="No. of Vacancies"
              type="number"
              placeholder="e.g. 3"
              value={formData.numberOfVacancies}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData({ numberOfVacancies: e.target.value })
              }
            />
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Reason for Posting Position</label>
              <Select value={formData.reasonForPosting} onValueChange={handleReasonForPostingChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New position">New position</SelectItem>
                  <SelectItem value="Replacement">Replacement</SelectItem>
                  <SelectItem value="Reliver">Reliver</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formData.reasonForPosting === "Other" && (
                <Input
                  className="w-full mt-2"
                  placeholder="Please specify"
                  value={formData.otherReasonForPosting}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFormData({ otherReasonForPosting: e.target.value })
                  }
                />
              )}
            </div>
          </div>
        </div>
        {/* Department Information */}
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
            Department Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Business Unit</label>
              <div className="flex items-center gap-4">
                <CustomRadio
                  name="businessUnit"
                  value="OODC"
                  checked={formData.businessUnit === "OODC"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFormData({ businessUnit: e.target.value })
                  }
                >
                  OODC
                </CustomRadio>
                <CustomRadio
                  name="businessUnit"
                  value="OORS"
                  checked={formData.businessUnit === "OORS"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFormData({ businessUnit: e.target.value })
                  }
                >
                  OORS
                </CustomRadio>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Department Name</label>
              <Select
                value={formData.departmentName}
                onValueChange={(value: string) => updateFormData({ departmentName: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ex: Information Technology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Information Technology">Information Technology</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                  <SelectItem value="Continuous Improvement Department">Continuous Improvement Department</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Levels of Interview</label>
              <Input
                type="number"
                className="w-full"
                value={formData.interviewLevels === 0 ? "" : formData.interviewLevels}
                onChange={handleInterviewLevelChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Immediate Supervisor</label>
              <Select
                value={formData.immediateSupervisor}
                onValueChange={(value: string) => updateFormData({ immediateSupervisor: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ex: Ms. Hailey Adams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hailey Adams">Ms. Hailey Adams</SelectItem>
                  <SelectItem value="John Smith">Mr. John Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Dynamic Hiring Manager Fields */}
          <div className="mt-6">
            <div className="grid grid-cols-2 bg-gray-100 p-3 font-medium text-sm text-gray-700 border border-gray-200 rounded-t-md">
              <div>LEVELS OF INTERVIEW</div>
              <div>HIRING MANAGERS</div>
            </div>
            {Array.from({ length: formData.interviewLevels }, (_, i) => (
              <div key={i} className="grid grid-cols-2 gap-4 items-center border-b border-gray-200 p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User2 className="w-4 h-4 text-gray-500" />
                  Hiring Manager {i + 1}
                </div>
                <Select onValueChange={(value: string) => console.log(`Hiring Manager ${i + 1}: ${value}`)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager A">Manager A</SelectItem>
                    <SelectItem value="Manager B">Manager B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-10">
          <Button className="bg-[#0056D2] hover:bg-blue-700 text-white" onClick={goToNextStep}>
            Next &rarr;
          </Button>
        </div>
      </div>
      <PreviewInfo step={step} formData={formData} />
    </div>
  )
}

function Step02({ goToNextStep, goToPreviousStep, step, formData, updateFormData }: NavigationProps) {
  const handleFromTimeChange = (time: string) => {
    updateFormData({ workScheduleFrom: time })
  }

  const handleToTimeChange = (time: string) => {
    updateFormData({ workScheduleTo: time })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
            Job Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Contract Type</label>
              <div className="flex items-center gap-4">
                <CustomRadio
                  name="contract"
                  value="Probationary"
                  checked={formData.contractType === "Probationary"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFormData({ contractType: e.target.value })
                  }
                >
                  Probationary
                </CustomRadio>
                <CustomRadio
                  name="contract"
                  value="Project"
                  checked={formData.contractType === "Project"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFormData({ contractType: e.target.value })
                  }
                >
                  Project
                </CustomRadio>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Work Arrangement</label>
              <div className="flex items-center gap-4">
                <CustomRadio
                  name="arrangement"
                  value="Hybrid"
                  checked={formData.workArrangement === "Hybrid"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFormData({ workArrangement: e.target.value })
                  }
                >
                  Hybrid
                </CustomRadio>
                <CustomRadio
                  name="arrangement"
                  value="Onsite"
                  checked={formData.workArrangement === "Onsite"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFormData({ workArrangement: e.target.value })
                  }
                >
                  Onsite
                </CustomRadio>
                <CustomRadio
                  name="arrangement"
                  value="Remote"
                  checked={formData.workArrangement === "Remote"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFormData({ workArrangement: e.target.value })
                  }
                >
                  Remote
                </CustomRadio>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select value={formData.category} onValueChange={(value: string) => updateFormData({ category: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Managerial">Managerial</SelectItem>
                  <SelectItem value="Supervisory">Supervisory</SelectItem>
                  <SelectItem value="Rank & File">Rank & File</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Position</label>
              <Select value={formData.position} onValueChange={(value: string) => updateFormData({ position: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Job Title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UI Design Manager">UI Design Manager</SelectItem>
                  <SelectItem value="Software Developer">Software Developer</SelectItem>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <InputField
              label="Working Site"
              placeholder="Makati"
              value={formData.workingSite}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ workingSite: e.target.value })}
            />
            {/* Combined Work Schedule row */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Work Schedule</label>
              <div className="flex gap-4">
                <TimePicker
                  label="From" // Label for the dialog
                  currentTime={formData.workScheduleFrom}
                  onChange={handleFromTimeChange}
                />
                <TimePicker
                  label="To" // Label for the dialog
                  currentTime={formData.workScheduleTo}
                  onChange={handleToTimeChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
            Job Description
          </h2>
          <div className="space-y-6">
            {[
              { key: "jobDescription", label: "Job Description", hasAI: true },
              { key: "responsibilities", label: "Responsibilities", hasAI: true },
              { key: "qualifications", label: "Qualifications", hasAI: true },
              { key: "nonNegotiables", label: "Non Negotiables", hasAI: false },
            ].map(({ key, label, hasAI }) => (
              <div key={key}>
                <label className="block text-sm font-semibold mb-1">{label}</label>
                <div className="relative">
                  <Textarea
                    placeholder="Input text"
                    className={`min-h-[90px] resize-none w-full ${hasAI ? "pr-20" : ""}`}
                    value={formData[key as keyof typeof formData] as string}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData({ [key]: e.target.value })}
                  />
                  {hasAI && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-2 right-2 text-[#8B8B8B] text-sm hover:bg-transparent flex items-center space-x-1"
                    >
                      <span>Ask AI</span>
                      <Wand2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
            Salary Budget
          </h2>
          <div className="space-y-4">
            <CustomCheckbox
              checked={formData.isSalaryRange}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ isSalaryRange: e.target.checked })}
            >
              Range
            </CustomCheckbox>
            {formData.isSalaryRange ? (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Minimum Amount"
                  placeholder="₱ 20,000"
                  value={formData.minSalary}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ minSalary: e.target.value })}
                />
                <InputField
                  label="Maximum Amount"
                  placeholder="₱ 25,000"
                  value={formData.maxSalary}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ maxSalary: e.target.value })}
                />
              </div>
            ) : (
              <InputField
                label="Salary Budget"
                placeholder="₱ 20,000"
                value={formData.salaryBudget}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ salaryBudget: e.target.value })}
              />
            )}
          </div>
        </div>
        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={goToPreviousStep}>
            &larr; Previous
          </Button>
          <Button className="bg-[#0056D2] hover:bg-blue-700 text-white" onClick={goToNextStep}>
            Next &rarr;
          </Button>
        </div>
      </div>
      <PreviewInfo step={step} formData={formData} />
    </div>
  )
}

function Step03({ goToNextStep, goToPreviousStep, step, formData, updateFormData }: NavigationProps) {
  const handleAssessmentTypeChange = (type: keyof AssessmentTypes) => {
    updateFormData({
      assessmentTypes: {
        ...formData.assessmentTypes,
        [type]: !formData.assessmentTypes[type],
      },
    })
  }

  const handleHardwareChange = (hardware: keyof HardwareRequired) => {
    updateFormData({
      hardwareRequired: {
        ...formData.hardwareRequired,
        [hardware]: !formData.hardwareRequired[hardware],
      },
    })
  }

  const handleSoftwareChange = (software: string) => {
    updateFormData({
      softwareRequired: {
        ...formData.softwareRequired,
        [software]: !formData.softwareRequired[software],
      },
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-[#0056D2] font-bold text-sm mb-4 border-l-4 border-[#0056D2] pl-2 uppercase">
          Assessments
        </h2>
        {/* Require Assessment */}
        <div>
          <label className="text-sm font-medium text-gray-700">Require Assessment:</label>
          <div className="flex items-center gap-6 mt-1">
            <CustomRadio
              name="assessmentRequired"
              value="Yes"
              checked={formData.assessmentRequired === "Yes"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData({ assessmentRequired: e.target.value })
              }
            >
              Yes
            </CustomRadio>
            <CustomRadio
              name="assessmentRequired"
              value="No"
              checked={formData.assessmentRequired === "No"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData({ assessmentRequired: e.target.value })
              }
            >
              No
            </CustomRadio>
          </div>
        </div>
        {/* Row: Other Assessment + Type of Assessment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Type of Assessment */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Type of Assessment</label>
            <div className="space-y-2 mt-1">
              <CustomCheckbox
                checked={formData.assessmentTypes.technical}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAssessmentTypeChange("technical")}
              >
                Technical Test
              </CustomCheckbox>
              <CustomCheckbox
                checked={formData.assessmentTypes.language}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAssessmentTypeChange("language")}
              >
                Language Proficiency Test
              </CustomCheckbox>
              <CustomCheckbox
                checked={formData.assessmentTypes.cognitive}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAssessmentTypeChange("cognitive")}
              >
                Cognitive Test
              </CustomCheckbox>
              <CustomCheckbox
                checked={formData.assessmentTypes.personality}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAssessmentTypeChange("personality")}
              >
                Personality Test
              </CustomCheckbox>
              <CustomCheckbox
                checked={formData.assessmentTypes.behavioral}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAssessmentTypeChange("behavioral")}
              >
                Behavioral Test
              </CustomCheckbox>
              <CustomCheckbox
                checked={formData.assessmentTypes.cultural}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAssessmentTypeChange("cultural")}
              >
                Cultural Test
              </CustomCheckbox>
            </div>
            <div className="mt-5 text-sm text-blue-600 cursor-pointer hover:underline inline-flex items-center gap-1">
              Generate to AI <Sparkles className="w-4 h-4" />
            </div>
          </div>
          {/* Other Assessment */}
          <div className="w-full">
            <div className="flex items-center mb-1">
              <label className="text-sm font-semibold text-gray-700 mr-2.5">Other Assessment</label>
              <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center cursor-pointer relative">
                <Plus className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <input
              type="text"
              value={formData.otherAssessment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ otherAssessment: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 bg-white placeholder:text-gray-400"
              placeholder="Psychological Test"
            />
          </div>
        </div>
        {/* Asset Request Section */}
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm mt-8 mb-4 border-l-4 border-[#0056D2] pl-2 uppercase flex items-center gap-2">
            ASSET REQUEST
            <span>
              <div className="w-3.5 h-3.5 rounded-full bg-gray-400 flex items-center justify-center cursor-pointer relative">
                <Plus className="w-2.5 h-2.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </span>
          </h2>
          {/* Hardware and Software Sections */}
          <div className="space-y-6">
            {/* Hardware */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block items-center gap-1">
                Hardware Required
              </label>
              <div className="space-y-2 mt-1">
                <CustomCheckbox
                  checked={formData.hardwareRequired.desktop}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHardwareChange("desktop")}
                >
                  Desktop
                </CustomCheckbox>
                <CustomCheckbox
                  checked={formData.hardwareRequired.handset}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHardwareChange("handset")}
                >
                  Handset
                </CustomCheckbox>
                <CustomCheckbox
                  checked={formData.hardwareRequired.headset}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHardwareChange("headset")}
                >
                  Headset
                </CustomCheckbox>
                <CustomCheckbox
                  checked={formData.hardwareRequired.laptop}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHardwareChange("laptop")}
                >
                  Laptop
                </CustomCheckbox>
              </div>
            </div>
            {/* Software */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                Software Required
                <span>
                  <div className="w-3.5 h-3.5 rounded-full bg-gray-400 flex items-center justify-center cursor-pointer relative">
                    <Plus className="w-2.5 h-2.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </span>
              </label>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
                {[
                  "Adobe Photoshop",
                  "Google Chrome",
                  "MS Teams",
                  "Open VPN",
                  "WinRAR",
                  "ZOHO",
                  "Email",
                  "Microsoft Office",
                  "Nitro Pro 8 PDF",
                  "Viber",
                  "Xlite",
                  "Zoom",
                ].map((software, index) => (
                  <CustomCheckbox
                    key={index}
                    checked={formData.softwareRequired[software]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSoftwareChange(software)}
                  >
                    {software}
                  </CustomCheckbox>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Navigation buttons */}
        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={goToPreviousStep}>
            &larr; Previous
          </Button>
          <Button className="bg-[#0056D2] hover:bg-blue-700 text-white" onClick={goToNextStep}>
            Next &rarr;
          </Button>
        </div>
      </div>
      {/* Preview Sidebar */}
      <div>
        <PreviewInfo step={step} formData={formData} />
      </div>
    </div>
  )
}

function Step04({ goToPreviousStep, step, formData, handleSubmit }: Step04Props) {
  // Get selected assessment types
  const selectedAssessments = Object.entries(formData.assessmentTypes)
    .filter(([, selected]) => selected)
    .map(([type]) => {
      const typeMap: { [key: string]: string } = {
        technical: "Technical Test",
        language: "Language Proficiency Test",
        cognitive: "Cognitive Test",
        personality: "Personality Test",
        behavioral: "Behavioral Test",
        cultural: "Cultural Test",
      }
      return typeMap[type]
    })

  // Get selected hardware
  const selectedHardware = Object.entries(formData.hardwareRequired)
    .filter(([, selected]) => selected)
    .map(([hardware]) => hardware.charAt(0).toUpperCase() + hardware.slice(1))

  // Get selected software
  const selectedSoftware = Object.entries(formData.softwareRequired)
    .filter(([, selected]) => selected)
    .map(([software]) => software)

  const displaySalary = formData.isSalaryRange
    ? `${formData.minSalary || "N/A"} - ${formData.maxSalary || "N/A"}`
    : formData.salaryBudget || "Not specified"

  const displayWorkSchedule =
    formData.workScheduleFrom && formData.workScheduleTo
      ? `${formData.workScheduleFrom} - ${formData.workScheduleTo}`
      : "Not specified"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 text-gray-800">
      {/* Left Content */}
      <div className="lg:col-span-2 space-y-10">
        {/* POSITION + DEPARTMENT INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* POSITION INFORMATION */}
          <div>
            <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase mb-4">
              Position Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Job Title</p>
                <p className="text-sm font-semibold text-gray-800">{formData.jobTitle || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Target Start Date</p>
                <p className="text-sm text-gray-800">{formData.targetStartDate || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Number of Vacancies</p>
                <p className="text-sm text-gray-800">{formData.numberOfVacancies || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Reason for Posting Position</p>
                <p className="text-sm text-gray-800">
                  {formData.reasonForPosting === "Other"
                    ? formData.otherReasonForPosting
                    : formData.reasonForPosting || "Not specified"}
                </p>
              </div>
            </div>
          </div>
          {/* DEPARTMENT INFORMATION */}
          <div>
            <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase mb-2">
              Department Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Business Unit</p>
                <p className="text-sm text-gray-800">{formData.businessUnit || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Levels of Interview</p>
                <p className="text-sm text-gray-800">{formData.interviewLevels}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Department Name</p>
                <p className="text-sm text-gray-800">{formData.departmentName || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Immediate Supervisor</p>
                <p className="text-sm text-gray-800">{formData.immediateSupervisor || "Not specified"}</p>
              </div>
            </div>
          </div>
          {/* JOB DETAILS */}
          <div>
            <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase mb-2 mt-2">
              Job Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Contract Type</p>
                <p className="text-sm text-gray-800">{formData.contractType || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Work Arrangement</p>
                <p className="text-sm text-gray-800">{formData.workArrangement || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="text-sm text-gray-800">{formData.category || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Subcategory</p>
                <p className="text-sm text-gray-800">{formData.position || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Working Site</p>
                <p className="text-sm text-gray-800">{formData.workingSite || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Working Schedule</p>
                <p className="text-sm text-gray-800">{displayWorkSchedule}</p>
              </div>
            </div>
          </div>
          {/* ASSESSMENTS */}
          <div>
            <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase mb-4">
              Assessments
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">Assessment Required:</p>
                <p className="text-sm text-gray-800">{formData.assessmentRequired}</p>
              </div>
              {selectedAssessments.length > 0 && (
                <ul className="list-disc list-inside text-gray-700 pl-2 text-sm">
                  {selectedAssessments.map((assessment, index) => (
                    <li key={index}>{assessment}</li>
                  ))}
                  {formData.otherAssessment && <li>{formData.otherAssessment}</li>}
                </ul>
              )}
            </div>
            <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase mb-4 mt-8">
              Asset Request
            </h2>
            <div className="space-y-4">
              {selectedHardware.length > 0 && (
                <>
                  <div className="flex items-center">
                    <p className="text-xs text-gray-500">Hardware</p>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 pl-2 text-sm">
                    {selectedHardware.map((hardware, index) => (
                      <li key={index}>{hardware}</li>
                    ))}
                  </ul>
                </>
              )}
              {selectedSoftware.length > 0 && (
                <>
                  <div className="flex items-center">
                    <p className="text-xs text-gray-500">Software</p>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 pl-2 text-sm">
                    {selectedSoftware.map((software, index) => (
                      <li key={index}>{software}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
        {/* JOB DESCRIPTION */}
        <div>
          <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase mb-2">
            Job Description
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-800">{formData.jobDescription || "Job description not provided yet..."}</p>
            <p className="text-sm font-bold mb-1">Key Responsibilities:</p>
            <p className="text-sm text-gray-700">
              {formData.responsibilities || "Responsibilities not specified yet..."}
            </p>
            <p className="text-sm font-bold mb-1">Qualifications:</p>
            <p className="text-sm text-gray-700">{formData.qualifications || "Qualifications not specified yet..."}</p>
            <p className="text-sm font-bold mb-1">Non-Negotiables:</p>
            <p className="text-sm text-gray-700">{formData.nonNegotiables || "Non-negotiables not specified yet..."}</p>
          </div>
          {/* SALARY BUDGET */}
          <div className="space-y-2 mt-6">
            <h2 className="text-[#0056D2] font-bold text-sm border-l-4 border-[#0056D2] pl-2 uppercase">
              SALARY BUDGET
            </h2>
            <p className="font-semibold text-gray-800">{displaySalary}</p>
          </div>
        </div>
        {/* BUTTONS */}
        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={goToPreviousStep}>
            &larr; Previous
          </Button>
          <Button className="bg-[#0056D2] hover:bg-blue-700 text-white" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
      {/* Right Content (Preview) */}
      <div>
        <PreviewInfo step={step} formData={formData} />
      </div>
    </div>
  )
}

export default function PRF() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    // Step 1 - Position Information
    jobTitle: "",
    targetStartDate: "",
    numberOfVacancies: "",
    reasonForPosting: "",
    otherReasonForPosting: "",

    // Step 1 - Department Information
    businessUnit: "",
    departmentName: "",
    interviewLevels: 4,
    immediateSupervisor: "",

    // Step 2 - Job Details
    contractType: "",
    workArrangement: "",
    category: "",
    position: "",
    workingSite: "",
    workScheduleFrom: "", // Initialize new field
    workScheduleTo: "", // Initialize new field

    // Step 2 - Job Description
    jobDescription: "",
    responsibilities: "",
    qualifications: "",
    nonNegotiables: "",
    salaryBudget: "",
    isSalaryRange: false,
    minSalary: "",
    maxSalary: "",

    // Step 3 - Assessments
    assessmentRequired: "Yes",
    assessmentTypes: {
      technical: true,
      language: true,
      cognitive: false,
      personality: true,
      behavioral: false,
      cultural: false,
    },
    otherAssessment: "Psychological Test",
    hardwareRequired: {
      desktop: false,
      handset: false,
      headset: true,
      laptop: true,
    },
    softwareRequired: {
      "Adobe Photoshop": true,
      "Google Chrome": false,
      "MS Teams": false,
      "Open VPN": false,
      WinRAR: false,
      ZOHO: false,
      Email: false,
      "Microsoft Office": true,
      "Nitro Pro 8 PDF": false,
      Viber: true,
      Xlite: false,
      Zoom: false,
    },
  })
  const [maxStepVisited, setMaxStepVisited] = useState(1)
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false)
  const [showSubmitConfirmDialog, setShowSubmitConfirmDialog] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false) // New state for custom popup

  useEffect(() => {
    document.title = "Personnel Requisition Form"
  }, [])

  const goToNextStep = () => {
    setStep((prev) => {
      const nextStep = Math.min(prev + 1, 4)
      setMaxStepVisited((currentMax) => Math.max(currentMax, nextStep))
      return nextStep
    })
  }
  const goToPreviousStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleCancelRequest = () => {
    setShowCancelConfirmDialog(true)
  }

  const handleConfirmCancel = () => {
    setShowCancelConfirmDialog(false)
    navigate("/requests")
  }

  const handleSaveAsDraft = () => {
    console.log("Saving form data as draft:", formData)
    setShowCancelConfirmDialog(false)
    navigate("/requests")
  }

  const handleSubmit = () => {
    setShowSubmitConfirmDialog(true)
  }

  const handleConfirmSubmit = () => {
    setShowSubmitConfirmDialog(false)
    console.log("Submitting form data:", formData)

    // Show custom success popup
    setShowSuccessPopup(true)

    // Hide popup and navigate after a delay
    setTimeout(() => {
      setShowSuccessPopup(false)
      navigate("/requests")
    }, 1500)
  }

  return (
    <>
      <Navbar />
      {showSuccessPopup && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-3 z-50 transition-all duration-300 ease-in-out">
          Request Sent! Your request has been sent successfully.
        </div>
      )}
      <div className="min-h-screen bg-white p-6 pt-[100px]">
        <div className="mx-auto max-w-7xl space-y-4">
          <h1 className="text-lg font-bold text-gray-800 mb-6">Personnel Requisition Form</h1>
          <div className="flex justify-between items-center mb-4">
            <a href="#" className="text-[#0056D2] text-sm hover:underline" onClick={handleCancelRequest}>
              &larr; Cancel Request
            </a>
          </div>
          <div className="flex space-x-0 border border-gray-300 rounded-md overflow-hidden mb-8">
            {["Step 01", "Step 02", "Step 03", "Step 04"].map((label, i) => (
              <div
                key={i}
                className={`flex-1 text-center py-2 text-sm font-semibold relative ${
                  i + 1 === step ? "bg-[#0056D2] text-white" : "bg-white text-gray-500"
                } ${i + 1 <= maxStepVisited && i + 1 !== step ? "cursor-pointer hover:bg-gray-100" : ""}`}
                onClick={() => {
                  if (i + 1 <= maxStepVisited && i + 1 !== step) {
                    setStep(i + 1)
                  }
                }}
              >
                {label}
                {i < 3 && <span className="absolute right-0 top-0 h-full w-px bg-gray-300" />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <Step01 goToNextStep={goToNextStep} step={step} formData={formData} updateFormData={updateFormData} />
          )}
          {step === 2 && (
            <Step02
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              step={step}
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {step === 3 && (
            <Step03
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              step={step}
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {step === 4 && (
            <Step04 goToPreviousStep={goToPreviousStep} step={step} formData={formData} handleSubmit={handleSubmit} />
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelConfirmDialog} onOpenChange={setShowCancelConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-800">Cancel Request</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Do you want to cancel the request form for this position?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={handleSaveAsDraft}>
              Save as Draft
            </Button>
            <Button variant="outline" onClick={() => setShowCancelConfirmDialog(false)}>
              No
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitConfirmDialog} onOpenChange={setShowSubmitConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-800">Submit Request</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Are you sure you want to submit this request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSubmitConfirmDialog(false)}>
              No, Go Back
            </Button>
            <Button className="bg-[#0056D2] hover:bg-blue-700 text-white" onClick={handleConfirmSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
