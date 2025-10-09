"use client"
import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, Search, MoreHorizontal, X } from "lucide-react"
import { Navbar } from "@/components/reusables/Navbar"
import { Label } from "@/components/ui/label"
import { useLocation } from "react-router-dom"


// Sample applicant data for job offers
const applicants = [
  {
    id: "001",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/32?u=001",
    offerStatus: "Not created",
  },
  {
    id: "002",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/32?u=002",
    offerStatus: "Job offer sent",
  },
  {
    id: "003",
    name: "Mike Chen",
    avatar: "https://i.pravatar.cc/32?u=003",
    offerStatus: "Re-offer sent",
  },
  {
    id: "004",
    name: "Emily Rodriguez",
    avatar: "https://i.pravatar.cc/32?u=004",
    offerStatus: "Not created",
  },
  {
    id: "005",
    name: "David Kim",
    avatar: "https://i.pravatar.cc/32?u=005",
    offerStatus: "Job offer sent",
  },
  {
    id: "006",
    name: "Lisa Wang",
    avatar: "https://i.pravatar.cc/32?u=006",
    offerStatus: "Not created",
  },
]

const statusStyles = {
  active: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
  inactive: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
}

interface SidebarCandidate {
  id: string
  name: string
  title: string
  stage: number
  stageColor: "orange" | "red" | "green"
  timeAgo: string
}

// Generate random reference ID
const generateReferenceId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Job Offer Document Modal Component
function JobOfferDocumentModal({
  isOpen,
  onClose,
  applicantName,
  jobTitle,
}: {
  isOpen: boolean
  onClose: () => void
  applicantName: string
  jobTitle: string
}) {
  if (!isOpen) return null

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const referenceId = generateReferenceId()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Document modal */}
      <div className="relative z-10 w-full max-w-4xl mx-4 max-h-[95vh] overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl">
          {/* Header with logo, edit button, and close button */}
          <div className="flex justify-between items-start p-6 border-b">
            <div className="flex items-center gap-4">
              <img src="/OODC logo2.png" alt="OODC Logo" width={128} height={128} className="h-32 w-auto" />
              <button className="text-blue-600 underline font-medium">Edit</button>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Document content */}
          <div className="p-8 space-y-6">
            {/* Date, Sender, Location */}
            <div className="space-y-2">
              <p className="font-bold">{today}</p>
              <p className="font-bold">HR Department</p>
              <p className="font-bold">Makati City</p>
            </div>

            {/* Reference ID */}
            <div className="mt-8">
              <p className="font-medium">#{referenceId}</p>
            </div>

            {/* Job Details */}
            <div className="mt-8 space-y-4 ml-4">
              <div className="flex">
                <span className="w-48 font-medium">I. Position:</span>
                <span>{jobTitle}</span>
              </div>

              <div className="flex">
                <span className="w-48 font-medium">II. Employment Status:</span>
                <span>Full-time</span>
              </div>

              <div className="flex flex-col">
                <div className="flex">
                  <span className="w-48 font-medium">III. Work Schedule:</span>
                  <span>5 days a week (9:00 AM - 6:00 PM)</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 ml-48">
                  **The company reserves the right to change your schedule as it deems necessary.
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex">
                  <span className="w-48 font-medium">IV. Work Assignment:</span>
                  <span>As per job description and company requirements</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 ml-48">
                  **The company reserves the right to change your work assignment and duties as it deems necessary.
                </p>
              </div>

              <div className="flex">
                <span className="w-48 font-medium">V. Immediate Head:</span>
                <span>Department Manager, Operations</span>
              </div>

              <div className="flex">
                <span className="w-48 font-medium">VI. Start Date:</span>
                <span>January 15, 2025</span>
                <span className="text-sm text-gray-600 ml-2">**or another mutually agreed upon date</span>
              </div>
            </div>

            {/* Compensation & Benefits Separator */}
            <div className="bg-blue-600 text-white text-center py-2 font-bold mt-8">COMPENSATION & BENEFITS</div>

            {/* Compensation Table */}
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse border border-gray-300">
    <thead>
      <tr>
        <th className="w-1/4 border border-gray-300 p-2 text-left font-bold">Cash</th>
        <th className="w-1/4 border border-gray-300 p-2 text-left font-bold">Monthly</th>
        <th className="w-1/4 border border-gray-300 p-2 text-left font-bold">Annual</th>
        <th className="w-1/4 border border-gray-300 p-2 text-left font-bold">Specifications</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 pl-4">Basic Pay</td>
                    <td className="border border-gray-300 p-2">₱25,000.00</td>
                    <td className="border border-gray-300 p-2">₱300,000.00</td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 pl-4">Allowance</td>
                    <td className="border border-gray-300 p-2">₱3,000.00</td>
                    <td className="border border-gray-300 p-2">₱36,000.00</td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 pl-4">Transportation</td>
                    <td className="border border-gray-300 p-2">₱2,000.00</td>
                    <td className="border border-gray-300 p-2">₱24,000.00</td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 pl-4">13th Month Pay</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2">₱25,000.00</td>
                    <td className="border border-gray-300 p-2">1/12 of the annual basic salary/Prorated monthly</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 pl-4">Mobile Allowance</td>
                    <td className="border border-gray-300 p-2">₱1,000.00</td>
                    <td className="border border-gray-300 p-2">₱12,000.00</td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 pl-4">Leave Conversion</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2">₱5,000.00</td>
                    <td className="border border-gray-300 p-2">
                      Convert up to 5 unused sick leaves after 1 year of service
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Cash Separator */}
            <div className="overflow-x-auto bg-lime-500 text-white font-bold">
  <table className="w-full table-fixed">
                <tr>
                <td className="w-1/4 p-2">Total Cash</td>
        <td className="w-1/4 p-2">₱31,000.00</td>
        <td className="w-1/4 p-2">₱397,000.00</td>
        <td className="w-1/4 p-2 text-center">₱402,000.00</td>
                </tr>
              </table>
            </div>

            {/* Other Variable Cash Benefits */}
            <div className="mt-6 overflow-x-auto w-full">
              <h3 className="font-bold text-lg mb-4">Other Variable Cash Benefit</h3>
              <table className="w-full border-collapse border border-gray-300 min-w-[800px]">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">SSS Employer Share</td>
                    <td className="border border-gray-300 p-2">₱1,455.00</td>
                    <td className="border border-gray-300 p-2">₱17,460.00</td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Philhealth Employer Share</td>
                    <td className="border border-gray-300 p-2">₱375.00</td>
                    <td className="border border-gray-300 p-2">₱4,500.00</td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Pag-ibig Employee Share</td>
                    <td className="border border-gray-300 p-2">₱200.00</td>
                    <td className="border border-gray-300 p-2">₱2,400.00</td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Vacation Leave Credits</td>
                    <td className="border border-gray-300 p-2">5 credits</td>
                    <td className="border border-gray-300 p-2">₱3,448.28</td>
                    <td className="border border-gray-300 p-2 whitespace-normal break-words">
                      5 days annually/subject to company vacation leave policy
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Sick Leave Credits</td>
                    <td className="border border-gray-300 p-2">5 credits</td>
                    <td className="border border-gray-300 p-2">₱3,448.28</td>
                    <td className="border border-gray-300 p-2 whitespace-normal break-words">5 days annually/subject to company sick leave policy</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Other Benefits */}
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-4">Other Benefits:</h3>
              <table className="w-full border-collapse border border-gray-300">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">Birthday Cake Benefit</td>
                    <td className="border border-gray-300 p-2">Yes</td>
                    <td className="border border-gray-300 p-2">Subject to the company's affordability</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">HMO</td>
                    <td className="border border-gray-300 p-2">Yes</td>
                    <td className="border border-gray-300 p-2">
                      Available after 8 months of employment, subject to the medical coverage policy and company
                      affordability
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Christmas Package</td>
                    <td className="border border-gray-300 p-2">Yes</td>
                    <td className="border border-gray-300 p-2">Subject to the company's affordability</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Company-Sponsored Events</td>
                    <td className="border border-gray-300 p-2">Yes</td>
                    <td className="border border-gray-300 p-2">
                      Christmas party and regular People Engagement Programs
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Employee Discounts</td>
                    <td className="border border-gray-300 p-2">Yes</td>
                    <td className="border border-gray-300 p-2">Discounts on One Tech Smart Solutions</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Potential Bonus</td>
                    <td className="border border-gray-300 p-2">Yes</td>
                    <td className="border border-gray-300 p-2">
                      Contingent upon the company's financial performance and profitability, as well as individual
                      performance throughout the year
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Annual Salary Increase</td>
                    <td className="border border-gray-300 p-2">Yes</td>
                    <td className="border border-gray-300 p-2">
                      Contingent upon the company's financial performance and profitability, as well as individual
                      performance throughout the year
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Commissions</td>
                    <td className="border border-gray-300 p-2">No</td>
                    <td className="border border-gray-300 p-2">
                      Applicable to employees in the Sales Department, based on the company's sales incentives or
                      commission structure program
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Referral Bonuses</td>
                    <td className="border border-gray-300 p-2">Yes</td>
                    <td className="border border-gray-300 p-2">Subject to company referral policy</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Employee Salary Loan Assistance</td>
                    <td className="border border-gray-300 p-2">Yes</td>
                    <td className="border border-gray-300 p-2">
                      Available after 6 months of employment, in accordance with the company's employee salary loan
                      assistance policy
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Legal Text */}
            <div className="mt-8 text-sm leading-relaxed">
              <p className="mb-4">
                This offer, along with your employment with the company, is contingent upon your successful completion
                of the medical examination, employment background verification, and all pre-employment requirements. If
                you accept our offer, please indicate your agreement by signing in the space provided below.
              </p>
              <p className="mb-6">Thank you, and we look forward to welcoming you to One Outsource.</p>
            </div>

            {/* Signature Section */}
            <div className="mt-8 grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <p className="font-medium mb-2">Prepared by:</p>
                  <p className="font-medium">Maria Santos</p>
                  <p className="text-sm">Specialist, Human Resources</p>
                  <p className="text-sm">One Outsource Group</p>
                </div>

                <div>
                  <p className="font-medium mb-2">Noted by:</p>
                  <p className="font-medium">Jennifer Cruz</p>
                  <p className="text-sm">Manager, Human Resources</p>
                  <p className="text-sm">One Outsource Group</p>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <p className="font-medium mb-2">Conforme:</p>
                <div className="mt-8">
                  <div className="border-b border-black w-full mb-2"></div>
                  <p className="text-sm text-center">{applicantName}</p>
                  <p className="text-xs text-center text-gray-600">Signature Over Printed Name</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sidebar Component
function Sidebar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const candidates: SidebarCandidate[] = [
    {
      id: "c1",
      name: "Jane Cruise",
      title: "Senior frontend developer",
      stage: 3,
      stageColor: "orange",
      timeAgo: "5d ago",
    },
    {
      id: "c2",
      name: "Green William",
      title: "UI/UX designer & developer",
      stage: 3,
      stageColor: "red",
      timeAgo: "4h ago",
    },
    {
      id: "c3",
      name: "Daniel Goldberg",
      title: "Magna lorem consectetur",
      stage: 1,
      stageColor: "green",
      timeAgo: "1 day ago",
    },
  ]

  const getStageColorClass = (color: "orange" | "red" | "green") => {
    switch (color) {
      case "orange":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "red":
        return "bg-red-100 text-red-800 border-red-200"
      case "green":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="w-full xl:w-[320px] bg-white xl:border-l border-gray-200 p-4 pt-4 space-y-4 xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto">
      {/* Calendar */}
      <div className="bg-white rounded-lg border p-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border-0 xl:scale-90 mx-auto"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Select defaultValue="stage-01">
          <SelectTrigger className="w-full text-xs">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stage-01">Stage: 01</SelectItem>
            <SelectItem value="stage-02">Stage: 02</SelectItem>
            <SelectItem value="stage-03">Stage: 03</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="today">
          <SelectTrigger className="w-full text-xs">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Candidates List */}
      <div className="space-y-2">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="flex items-start gap-2 p-2 rounded-lg border hover:bg-gray-50">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${candidate.id}`} alt={candidate.name} />
              <AvatarFallback className="text-xs">{candidate.name.split(" ").map((n) => n[0])}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-xs">{candidate.name}</p>
                  <p className="text-xs text-gray-500 mb-1">{candidate.title}</p>
                  <Badge variant="outline" className={`text-xs ${getStageColorClass(candidate.stageColor)}`}>
                    Stage {candidate.stage}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-1">{candidate.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Confirmation Modal Component
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Light grey transparent overlay */}
      <div className="absolute inset-0 bg-gray-500/30" onClick={onClose} />

      {/* Confirmation modal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          {/* Header */}
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Confirm Job Offer Submission</h2>

          {/* Content */}
          <p className="text-black mb-6">
            {"You're about to send this job offer to the selected candidate. Do you want to proceed?"}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button onClick={onConfirm} className="bg-blue-600 text-white hover:bg-blue-700">
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Job Offer Form Modal Component
function JobOfferFormModal({
  isOpen,
  onClose,
 
  onSend,
}: {
  isOpen: boolean
  onClose: () => void
  applicantName: string
  jobTitle: string
  onSend: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Form modal */}
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Create Job Offer</h2>
            <hr className="border-blue-600 border-t-2" />
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {/* First Row: Daily Rate and Minimum Wage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="daily-rate" className="text-sm font-medium text-gray-700 mb-1 block">
                  Daily Rate
                </Label>
                <Input id="daily-rate" placeholder="Enter daily rate" />
              </div>
              <div>
                <Label htmlFor="minimum-wage" className="text-sm font-medium text-gray-700 mb-1 block">
                  Minimum Wage
                </Label>
                <Input id="minimum-wage" placeholder="Enter minimum wage" />
              </div>
            </div>

            {/* Second Row: Basic Pay and Allowance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="basic-pay" className="text-sm font-medium text-gray-700 mb-1 block">
                  Basic Pay
                </Label>
                <Input id="basic-pay" placeholder="Enter basic pay" />
              </div>
              <div>
                <Label htmlFor="allowance" className="text-sm font-medium text-gray-700 mb-1 block">
                  Allowance
                </Label>
                <Input id="allowance" placeholder="Enter allowance" />
              </div>
            </div>

            {/* Third Row: Transportation and Mobile Allowance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transportation" className="text-sm font-medium text-gray-700 mb-1 block">
                  Transportation
                </Label>
                <Input id="transportation" placeholder="Enter transportation allowance" />
              </div>
              <div>
                <Label htmlFor="mobile-allowance" className="text-sm font-medium text-gray-700 mb-1 block">
                  Mobile Allowance
                </Label>
                <Input id="mobile-allowance" placeholder="Enter mobile allowance" />
              </div>
            </div>

            {/* Fourth Row: Vacation Leave Credits and Sick Leave Credits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vacation-leave" className="text-sm font-medium text-gray-700 mb-1 block">
                  Vacation Leave Credits
                </Label>
                <Input id="vacation-leave" placeholder="Enter vacation leave credits" />
              </div>
              <div>
                <Label htmlFor="sick-leave" className="text-sm font-medium text-gray-700 mb-1 block">
                  Sick Leave Credits
                </Label>
                <Input id="sick-leave" placeholder="Enter sick leave credits" />
              </div>
            </div>

            {/* Other Benefits Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Other Benefits</h3>

              {/* Birthday Cake Benefit and Potential Bonus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="birthday-cake" className="text-sm font-medium text-gray-700 mb-1 block">
                    Birthday Cake Benefit
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="potential-bonus" className="text-sm font-medium text-gray-700 mb-1 block">
                    Potential Bonus
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Christmas Package and Annual Salary Increase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="christmas-package" className="text-sm font-medium text-gray-700 mb-1 block">
                    Christmas Package
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salary-increase" className="text-sm font-medium text-gray-700 mb-1 block">
                    Annual Salary Increase
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* HMO and Commissions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="hmo" className="text-sm font-medium text-gray-700 mb-1 block">
                    HMO
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="commissions" className="text-sm font-medium text-gray-700 mb-1 block">
                    Commissions
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Company Sponsored Events and Referral Bonuses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="company-events" className="text-sm font-medium text-gray-700 mb-1 block">
                    Company Sponsored Events
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="referral-bonuses" className="text-sm font-medium text-gray-700 mb-1 block">
                    Referral Bonuses
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Employment Discounts and Employee Salary Load Assistance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employment-discounts" className="text-sm font-medium text-gray-700 mb-1 block">
                    Employment Discounts
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salary-load-assistance" className="text-sm font-medium text-gray-700 mb-1 block">
                    Employee Salary Load Assistance
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button onClick={onSend} className="bg-blue-600 text-white hover:bg-blue-700">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Reject Offer Modal Component
function RejectOfferModal({
  isOpen,
  onClose,
  applicantName,
}: { isOpen: boolean; onClose: () => void; applicantName: string }) {
  const [selectedAction, setSelectedAction] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Form modal */}
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Reject Job Offer</h2>
            <p className="text-gray-700 mb-4">This applicant has been marked as rejected.</p>
          </div>

          {/* Radio Buttons */}
          <div className="mb-4">
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="reject"
                  name="action"
                  value="reject"
                  checked={selectedAction === "reject"}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="reject" className="text-sm font-medium text-gray-700">
                  Reject
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="resend"
                  name="action"
                  value="resend"
                  checked={selectedAction === "resend"}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="resend" className="text-sm font-medium text-gray-700">
                  Resend Job Offer
                </label>
              </div>
            </div>
          </div>

          {/* Form Content - Show when "reject" is selected */}
          {selectedAction === "reject" && (
            <>
              {/* Horizontal blue line */}
              <hr className="border-blue-600 border-t-2 mb-6" />

              <div className="space-y-4">
                {/* Reason for Rejecting Dropdown */}
                <div>
                  <Label htmlFor="reject-reason" className="text-sm font-medium text-gray-700 mb-1 block">
                    Reason for Rejecting
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason for rejection" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qualifications">Does not meet qualifications</SelectItem>
                      <SelectItem value="experience">Insufficient experience</SelectItem>
                      <SelectItem value="salary">Salary expectations too high</SelectItem>
                      <SelectItem value="availability">Availability issues</SelectItem>
                      <SelectItem value="cultural-fit">Not a cultural fit</SelectItem>
                      <SelectItem value="better-candidate">Found a better candidate</SelectItem>
                      <SelectItem value="position-filled">Position already filled</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Remarks Text Area */}
                <div>
                  <Label htmlFor="remarks" className="text-sm font-medium text-gray-700 mb-1 block">
                    Remarks
                  </Label>
                  <textarea
                    id="remarks"
                    placeholder="Add your remarks here..."
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Resend Job Offer Form - Show when "resend" is selected */}
          {selectedAction === "resend" && (
            <>
              {/* Horizontal blue line */}
              <hr className="border-blue-600 border-t-2 mb-6" />

              <div className="space-y-6">
                {/* Remarks for Resending */}
                <div>
                  <Label htmlFor="resend-remarks" className="text-sm font-medium text-gray-700 mb-1 block">
                    Remarks for Resending Job Offer
                  </Label>
                  <textarea
                    id="resend-remarks"
                    placeholder="Add your remarks for resending the job offer..."
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* First Row: Daily Rate and Minimum Wage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="daily-rate" className="text-sm font-medium text-gray-700 mb-1 block">
                      Daily Rate
                    </Label>
                    <Input id="daily-rate" placeholder="Enter daily rate" />
                  </div>
                  <div>
                    <Label htmlFor="minimum-wage" className="text-sm font-medium text-gray-700 mb-1 block">
                      Minimum Wage
                    </Label>
                    <Input id="minimum-wage" placeholder="Enter minimum wage" />
                  </div>
                </div>

                {/* Second Row: Basic Pay and Allowance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="basic-pay" className="text-sm font-medium text-gray-700 mb-1 block">
                      Basic Pay
                    </Label>
                    <Input id="basic-pay" placeholder="Enter basic pay" />
                  </div>
                  <div>
                    <Label htmlFor="allowance" className="text-sm font-medium text-gray-700 mb-1 block">
                      Allowance
                    </Label>
                    <Input id="allowance" placeholder="Enter allowance" />
                  </div>
                </div>

                {/* Third Row: Transportation and Mobile Allowance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transportation" className="text-sm font-medium text-gray-700 mb-1 block">
                      Transportation
                    </Label>
                    <Input id="transportation" placeholder="Enter transportation allowance" />
                  </div>
                  <div>
                    <Label htmlFor="mobile-allowance" className="text-sm font-medium text-gray-700 mb-1 block">
                      Mobile Allowance
                    </Label>
                    <Input id="mobile-allowance" placeholder="Enter mobile allowance" />
                  </div>
                </div>

                {/* Fourth Row: Vacation Leave Credits and Sick Leave Credits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vacation-leave" className="text-sm font-medium text-gray-700 mb-1 block">
                      Vacation Leave Credits
                    </Label>
                    <Input id="vacation-leave" placeholder="Enter vacation leave credits" />
                  </div>
                  <div>
                    <Label htmlFor="sick-leave" className="text-sm font-medium text-gray-700 mb-1 block">
                      Sick Leave Credits
                    </Label>
                    <Input id="sick-leave" placeholder="Enter sick leave credits" />
                  </div>
                </div>

                {/* Other Benefits Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Other Benefits</h3>

                  {/* Birthday Cake Benefit and Potential Bonus */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="birthday-cake" className="text-sm font-medium text-gray-700 mb-1 block">
                        Birthday Cake Benefit
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="potential-bonus" className="text-sm font-medium text-gray-700 mb-1 block">
                        Potential Bonus
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Christmas Package and Annual Salary Increase */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="christmas-package" className="text-sm font-medium text-gray-700 mb-1 block">
                        Christmas Package
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="salary-increase" className="text-sm font-medium text-gray-700 mb-1 block">
                        Annual Salary Increase
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* HMO and Commissions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="hmo" className="text-sm font-medium text-gray-700 mb-1 block">
                        HMO
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="commissions" className="text-sm font-medium text-gray-700 mb-1 block">
                        Commissions
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Company Sponsored Events and Referral Bonuses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="company-events" className="text-sm font-medium text-gray-700 mb-1 block">
                        Company Sponsored Events
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="referral-bonuses" className="text-sm font-medium text-gray-700 mb-1 block">
                        Referral Bonuses
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Employment Discounts and Employee Salary Load Assistance */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employment-discounts" className="text-sm font-medium text-gray-700 mb-1 block">
                        Employment Discounts
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="salary-load-assistance" className="text-sm font-medium text-gray-700 mb-1 block">
                        Employee Salary Load Assistance
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedAction === "reject") {
                  console.log(`Job offer rejected for ${applicantName}!`)
                } else if (selectedAction === "resend") {
                  console.log(`Job offer resent to ${applicantName}!`)
                }
                onClose()
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Rescind Offer Modal Component
function RescindOfferModal({
  isOpen,
  onClose,
  applicantName,
}: { isOpen: boolean; onClose: () => void; applicantName: string }) {
  const [selectedOption, setSelectedOption] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Form modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Rescind Job Offer</h2>
            <p className="text-gray-700 mb-4">Are you sure you want to rescind the offer made to this applicant?</p>
          </div>

          {/* Radio Buttons */}
          <div className="mb-4">
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="yes"
                  name="rescind"
                  value="yes"
                  checked={selectedOption === "yes"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="yes" className="text-sm font-medium text-gray-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="no"
                  name="rescind"
                  value="no"
                  checked={selectedOption === "no"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="no" className="text-sm font-medium text-gray-700">
                  No
                </label>
              </div>
            </div>
          </div>

          {/* Form Content - Always show the form */}
          <>
            {/* Horizontal blue line */}
            <hr className="border-blue-600 border-t-2 mb-6" />

            <div className="space-y-4">
              {/* Reason for Rescinding Dropdown */}
              <div>
                <Label htmlFor="rescind-reason" className="text-sm font-medium text-gray-700 mb-1 block">
                  Reason for rescinding the offer
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason for rescinding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget-constraints">Budget constraints</SelectItem>
                    <SelectItem value="position-eliminated">Position eliminated</SelectItem>
                    <SelectItem value="hiring-freeze">Hiring freeze</SelectItem>
                    <SelectItem value="better-candidate">Found a better candidate</SelectItem>
                    <SelectItem value="candidate-issues">Issues with candidate background</SelectItem>
                    <SelectItem value="business-changes">Business requirements changed</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Remarks Text Area */}
              <div>
                <Label htmlFor="rescind-remarks" className="text-sm font-medium text-gray-700 mb-1 block">
                  Remarks
                </Label>
                <textarea
                  id="rescind-remarks"
                  placeholder="Add your remarks here..."
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log(`Job offer rescinded for ${applicantName}!`)
                onClose()
              }}
              disabled={selectedOption === "no"}
              className={`${
                selectedOption === "no"
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function JobOfferManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("")
  const [jobStatus, setJobStatus] = useState("active")

  const navigate = useNavigate()

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [isJobOfferFormOpen, setIsJobOfferFormOpen] = useState(false)
  const [isJobOfferDocumentOpen, setIsJobOfferDocumentOpen] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState("")

  const [isRejectOfferOpen, setIsRejectOfferOpen] = useState(false)
  const [selectedApplicantForReject, setSelectedApplicantForReject] = useState("")

  const [isRescindOfferOpen, setIsRescindOfferOpen] = useState(false)
  const [selectedApplicantForRescind, setSelectedApplicantForRescind] = useState("")

  const handleSendJobOffer = (applicantName: string) => {
    setSelectedApplicant(applicantName)
    setIsConfirmationOpen(true)
  }

  const handleConfirmJobOffer = () => {
    setIsConfirmationOpen(false)
    setIsJobOfferFormOpen(true)
  }

  const handleSendDocument = () => {
    setIsJobOfferFormOpen(false)
    setIsJobOfferDocumentOpen(true)
  }

  const handleCloseAllModals = () => {
    setIsConfirmationOpen(false)
    setIsJobOfferFormOpen(false)
    setIsJobOfferDocumentOpen(false)
    setIsRejectOfferOpen(false)
    setIsRescindOfferOpen(false)
  }

  const handleRejectOffer = (applicantName: string) => {
    setSelectedApplicantForReject(applicantName)
    setIsRejectOfferOpen(true)
  }

  const handleRescindOffer = (applicantName: string) => {
    setSelectedApplicantForRescind(applicantName)
    setIsRescindOfferOpen(true)
  }

  // Filter applicants based on search term
  const filteredApplicants = applicants.filter((applicant) =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatJobTitle = (slug?: string) => {
    const titleMap: Record<string, string> = {
      leaddeveloper: "Lead Developer",
      projectmanager: "Project Manager",
      socialcontentmanager: "Social Content Manager",
      senioruiuxdesigner: "Senior UI/UX Designer",
      customersupport: "Customer Support",
      qaengineer: "QA Engineer",
      humanresourcescoordinator: "Human Resources Coordinator",
      operationsmanager: "Operations Manager",
      socialmediamanager: "Social Media Manager",
      marketingspecialist: "Marketing Specialist",
      seniorsoftwareengineer: "Senior Software Engineer",
    }
    return slug ? titleMap[slug.toLowerCase()] || slug.replace(/([a-z])([A-Z])/g, "$1 $2") : "Unknown Job"
  }

  const { jobtitle } = useParams<{ jobtitle: string }>()
  const resolvedJobTitle = formatJobTitle(jobtitle)

  const location = useLocation()
  const previousPath = location.state?.from
  const customStage = "OfferAndFinalization";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 mt-20">
        <div className="flex flex-col xl:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-4">
            <div className="mx-auto max-w-none space-y-4">
              {/* Header Section */}
              <div className="space-y-3">
                {/* Back Button and Job Title */}
                <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      if (previousPath?.includes("/weekly")) {
                        navigate(`/job/${jobtitle}/weekly`)
                      } else {
                        navigate(`/job/${jobtitle}`)
                      }
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>

                  <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 text-center sm:text-left">{resolvedJobTitle}</h1>

                    <Select value={jobStatus} onValueChange={setJobStatus}>
                      <SelectTrigger
                        className={`mt-10 sm:mt-0 w-auto min-w-[80px] text-xs font-medium border rounded px-2 py-0.5 ${statusStyles[jobStatus as keyof typeof statusStyles]}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Job Details */}
                <div className="flex flex-col items-center text-center gap-2 text-xs text-gray-600 sm:flex-row sm:items-center sm:text-left sm:gap-4">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Employment Type:</span>
                    <span>Full Time</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Start Date:</span>
                    <span>January 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Work Mode:</span>
                    <span>Onsite</span>
                  </div>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:items-center">
                  <Select
                    value={selectedFilter || "forjoboffer"}
                    onValueChange={(value) => {
                      setSelectedFilter(value)
                      if (jobtitle) {
                        navigate(`/job/${jobtitle}/${value}`)
                      }
                    }}
                  >
                    <SelectTrigger className="w-40 border-none shadow-none font-bold text-black text-sm">
                      <SelectValue placeholder="Shortlisted" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="font-bold" value="resumescreening">
                        Resume Screening
                      </SelectItem>
                      <SelectItem value="phonecallinterview" className="font-bold">
                        Phone Call Interview
                      </SelectItem>
                      <SelectItem value="shortlisted" className="font-bold">
                        Shortlisted
                      </SelectItem>
                      <SelectItem value="initialinterview" className="font-bold">
                        Initial Interview
                      </SelectItem>
                      <SelectItem value="assessments" className="font-bold">
                        Assessments
                      </SelectItem>
                      <SelectItem value="finalinterview" className="font-bold">
                        Final Interview
                      </SelectItem>
                      <SelectItem value="forjoboffer" className="font-bold">
                        For Job Offer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search applicants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-48 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Job Offer Table */}
              <div className="mt-4 rounded-md border bg-white overflow-x-auto">
                <Table className="table-fixed text-xs lg:min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center align-center w-24 border table-fixed border-gray-200 py-2 px-3 text-xs lg:text-sm lg:py-3 lg:px-4">
  ID
</TableHead>

                      <TableHead className="text-center align-center border border-gray-200 py-2 px-3 w-48 text-xs lg:text-sm lg:py-3 lg:px-4">
                        Full Name
                      </TableHead>
                      <TableHead className="border border-gray-200 py-2 px-3 w-32 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                        Status of <br></br> Job Offer
                      </TableHead>
                      <TableHead className="border border-gray-200 py-2 px-3 w-32 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                        Job Offer
                      </TableHead>
                      <TableHead className="border border-gray-200 py-2 px-3 w-80 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplicants.length > 0 ? (
                      filteredApplicants.map((applicant) => (
                        <TableRow key={applicant.id} className="hover:bg-gray-50 h-16 lg:h-20">
                          <TableCell className="text-center align-center border border-gray-200 py-3 px-3 font-medium text-xs lg:text-sm align-middle">
  {applicant.id}
</TableCell>



                          <TableCell className="border border-gray-200 py-3 px-1 lg:py-4 lg:px-4 align-middle">
                            <div className="flex items-center justify-center gap-2 lg:gap-3">
                              <Avatar className="h-6 w-6 lg:h-8 lg:w-8 flex-shrink-0">
                                <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs lg:text-sm">
                                  {applicant.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-xs lg:text-sm break-words leading-tight">
                                {applicant.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center align-center border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 text-xs lg:text-sm align-middle">
                            {applicant.offerStatus}
                          </TableCell>
                          <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 text-center align-middle">
                            <Button
                              onClick={() => handleSendJobOffer(applicant.name)}
                              className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg px-4 py-2 text-xs lg:text-sm whitespace-normal lg: h-10"
                            >
                              Send Job Offer
                            </Button>
                          </TableCell>
                          <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 align-middle">
                            <div className="flex gap-2 justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="lg: h-10 bg-white text-green-700 border border-green-500 hover:bg-green-500 hover:text-white rounded-lg px-3 py-1 text-xs"
                              onClick={() =>
  navigate(`/job/stage/${customStage}`, {
    state: {
      jobTitle: jobtitle,
      from: location.pathname
    }
  })
}>
                                Accepted
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectOffer(applicant.name)}
                                className="lg: h-10 bg-white text-red-700 border border-red-500 hover:bg-red-500 hover:text-white rounded-lg px-3 py-1 text-xs"
                              >
                                Rejected
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRescindOffer(applicant.name)}
                                className="lg: h-10 bg-white text-yellow-700 border border-yellow-400 hover:bg-yellow-400 hover:text-white rounded-lg px-3 py-1 text-xs"
                              >
                                Rescind Offer
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="border border-gray-200 p-6 lg:p-8 text-center text-gray-500 text-xs lg:text-sm"
                        >
                          No applicants found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Results Summary */}
              {searchTerm && (
                <div className="text-xs lg:text-sm text-gray-600">
                  Showing {filteredApplicants.length} of {applicants.length} applicants
                  {searchTerm && ` for "${searchTerm}"`}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <Sidebar />
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          onConfirm={handleConfirmJobOffer}
        />

        {/* Job Offer Form Modal */}
        <JobOfferFormModal
          isOpen={isJobOfferFormOpen}
          onClose={() => setIsJobOfferFormOpen(false)}
          applicantName={selectedApplicant}
          jobTitle={resolvedJobTitle}
          onSend={handleSendDocument}
        />

        {/* Job Offer Document Modal */}
        <JobOfferDocumentModal
          isOpen={isJobOfferDocumentOpen}
          onClose={handleCloseAllModals}
          applicantName={selectedApplicant}
          jobTitle={resolvedJobTitle}
        />

        {/* Reject Offer Modal */}
        <RejectOfferModal
          isOpen={isRejectOfferOpen}
          onClose={() => setIsRejectOfferOpen(false)}
          applicantName={selectedApplicantForReject}
        />

        {/* Rescind Offer Modal */}
        <RescindOfferModal
          isOpen={isRescindOfferOpen}
          onClose={() => setIsRescindOfferOpen(false)}
          applicantName={selectedApplicantForRescind}
        />
      </div>
    </>
  )
}
