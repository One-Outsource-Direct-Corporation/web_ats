"use client"

import { Navbar } from "@/components/reusables/Navbar"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronDown, Check, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

type Status = "Draft" | "Pending" | "On Hold" | "Closed" | "Cancelled"

interface ApprovalStep {
  name: string
  status: "approved" | "pending"
}

interface RequestedPosition {
  title: string
  status: Status
  manager: string
  date: string
  department: string
  approver: string
  approvalPipeline?: ApprovalStep[]
}

// Approver names pool
const approverNames = ["Ryan Bang", "Lily Cruz", "Victor Magtangol", "Joseph Santos", "Virla Getalado"]

// Generate random approval pipeline
const generateApprovalPipeline = (): ApprovalStep[] => {
  const totalSteps = Math.floor(Math.random() * 5) + 1 // 1 to 5 steps
  const approvedSteps = Math.floor(Math.random() * totalSteps) // Random number of approved steps

  const pipeline: ApprovalStep[] = []
  const shuffledApprovers = [...approverNames].sort(() => Math.random() - 0.5)

  for (let i = 0; i < totalSteps; i++) {
    pipeline.push({
      name: shuffledApprovers[i % shuffledApprovers.length],
      status: i < approvedSteps ? "approved" : "pending",
    })
  }

  return pipeline
}

// Generate approving officer string from pipeline
const generateApprovingOfficer = (pipeline: ApprovalStep[]): string => {
  const names = pipeline.map((step) => step.name)
  if (names.length <= 2) {
    return names.join(" and ")
  } else {
    return names.slice(0, -1).join(", ") + ", and " + names[names.length - 1]
  }
}

// Generate positions with consistent approving officers
const generatePositions = (): RequestedPosition[] => {
  const basePositions = [
    {
      title: "UI Designer",
      status: "Draft" as Status,
      manager: "Mario Perez",
      date: "—",
      department: "CI Department",
    },
    {
      title: "Sales Agent",
      status: "Pending" as Status,
      manager: "Elizabeth Hall",
      date: "21/10/2023",
      department: "Sales Department",
    },
    {
      title: "Marketing Agent",
      status: "On Hold" as Status,
      manager: "Juan Martin",
      date: "26/10/2022",
      department: "Marketing Department",
    },
    {
      title: "Quality Assurance Engineer",
      status: "Closed" as Status,
      manager: "Lauren Taylor",
      date: "23/03/2020",
      department: "CI Department",
    },
    {
      title: "Backend Developer",
      status: "Pending" as Status,
      manager: "Sarah Johnson",
      date: "15/11/2023",
      department: "Engineering Department",
    },
    {
      title: "Product Manager",
      status: "Pending" as Status,
      manager: "Michael Chen",
      date: "08/11/2023",
      department: "Product Department",
    },
    {
      title: "Data Scientist",
      status: "Draft" as Status,
      manager: "Amanda Rodriguez",
      date: "—",
      department: "Analytics Department",
    },
    {
      title: "DevOps Engineer",
      status: "Pending" as Status,
      manager: "David Kim",
      date: "12/11/2023",
      department: "Engineering Department",
    },
    {
      title: "Content Marketing Specialist",
      status: "On Hold" as Status,
      manager: "Jessica Wong",
      date: "05/10/2023",
      department: "Marketing Department",
    },
    {
      title: "Customer Success Manager",
      status: "Pending" as Status,
      manager: "Robert Brown",
      date: "18/11/2023",
      department: "Customer Success Department",
    },
    {
      title: "Financial Analyst",
      status: "Closed" as Status,
      manager: "Lisa Anderson",
      date: "14/09/2023",
      department: "Finance Department",
    },
    {
      title: "HR Business Partner",
      status: "Draft" as Status,
      manager: "Thomas Wilson",
      date: "—",
      department: "Human Resources Department",
    },
    {
      title: "Software Engineer",
      status: "Pending" as Status,
      manager: "Emily Davis",
      date: "22/11/2023",
      department: "Engineering Department",
    },
    {
      title: "Graphic Designer",
      status: "On Hold" as Status,
      manager: "Carlos Martinez",
      date: "30/09/2023",
      department: "Design Department",
    },
    {
      title: "Business Analyst",
      status: "Pending" as Status,
      manager: "Rachel Green",
      date: "25/11/2023",
      department: "Operations Department",
    },
  ]

  return basePositions.map((position) => {
    if (position.status === "Pending") {
      const pipeline = generateApprovalPipeline()
      return {
        ...position,
        approvalPipeline: pipeline,
        approver: generateApprovingOfficer(pipeline),
      }
    } else {
      // For non-pending items, generate a simple approver list
      const randomApprovers = [...approverNames]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 2)
      return {
        ...position,
        approver: generateApprovingOfficer(randomApprovers.map((name) => ({ name, status: "approved" as const }))),
      }
    }
  })
}

export default function Requests() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<number[]>([])
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All")
  const [positions, setPositions] = useState<RequestedPosition[]>(generatePositions())

  // State for filter dropdowns
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("all");

  useEffect(() => {
    document.title = "Requests"
  }, [])

  const filtered = positions.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "All" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectAllToggle = () => {
    if (selected.length === filtered.length && filtered.length > 0) {
      setSelected([])
    } else {
      setSelected(filtered.map((_, idx) => idx))
    }
  }

  const handleCancelRequest = () => {
    setPositions((prevPositions) =>
      prevPositions.map((position, globalIdx) => {
        // Find the filtered index that corresponds to this global index
        const filteredIdx = filtered.findIndex((filteredPos) => filteredPos === position)

        // If this position is selected and has "Pending" status, change it to "Cancelled"
        if (selected.includes(filteredIdx) && position.status === "Pending") {
          return {
            ...position,
            status: "Cancelled" as Status,
            approvalPipeline: undefined, // Remove pipeline for cancelled items
          }
        }
        return position
      }),
    )
    setSelected([])
    setShowCancelDialog(false)
  }

  const statusColors: Record<Status, string> = {
    Draft: "bg-gray-100 text-gray-500",
    Pending: "bg-orange-100 text-orange-500",
    "On Hold": "bg-red-100 text-red-500",
    Closed: "bg-yellow-100 text-yellow-600",
    Cancelled: "bg-red-100 text-red-600",
  }

  const ApprovalPipelineDropdown = ({ pipeline }: { pipeline: ApprovalStep[] }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="p-3">
            <h4 className="font-medium text-sm mb-3">Approval Pipeline</h4>
            <div className="relative">
              {" "}
              {/* Add relative positioning for the line */}
              <div className="absolute left-[9px] top-0 bottom-0 w-px bg-gray-400"></div> {/* Vertical gray line */}
              <div className="space-y-2">
                {pipeline.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 z-10 bg-white rounded-full">
                      {" "}
                      {/* Add z-10 and bg-white to mask the line */}
                      {step.status === "approved" ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                          <Clock className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs">
                        {" "}
                        {/* Change text size to xs */}
                        <span className="font-medium">
                          {step.status === "approved" ? "Approved by" : "Pending Approval by"}
                        </span>
                        <span className="ml-1">{step.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-[100px] bg-gray-50"> {/* Adjusted pt for fixed header */}
        {/* Fixed top filter/search section */}
        <div className="fixed top-[64px] left-0 right-0 z-20 bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
          <div className="max-w-7xl mx-auto space-y-3">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800">Request</h1>
            <p className="text-lg text-gray-700">Handles hiring requests and approvals.</p>
            {/* Filters */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Input
                placeholder="Search requests..." // Updated placeholder
                className="w-64" // Fixed width for consistency
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 ml-auto">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status | "All")}>
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedOffice} onValueChange={setSelectedOffice}>
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="All Offices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Offices</SelectItem>
                    {/* Add more SelectItem components for specific offices if needed */}
                  </SelectContent>
                </Select>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {/* Add more SelectItem components for specific departments if needed */}
                  </SelectContent>
                </Select>
                <Select value={selectedEmploymentType} onValueChange={setSelectedEmploymentType}>
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder="All Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employment Type</SelectItem>
                    {/* Add more SelectItem components for specific employment types if needed */}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full sm:w-auto bg-transparent" onClick={() => navigate("/prf")}>
                  Create PRF
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content section */}
        <main className="flex-grow px-6 pt-[150px] pb-[80px] max-w-7xl mx-auto w-full"> {/* Adjusted pt for main content */}
          <h4 className="text-2xl font-bold mb-4">Requested Positions</h4> {/* Moved here */}
          {/* Select All Row */}
          <div className="flex justify-between items-center pb-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={handleSelectAllToggle}
                  className="w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
                />
                Select All
              </label>
            </div>

            {/* Action buttons - appear when items are selected */}
            {selected.length > 0 && ( // Changed condition to simply check if any item is selected
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  {/* Show Cancel button if any selected items are Pending */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    Cancel
                  </Button>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-50 text-gray-700 text-left">
                <tr>
                  <th className="px-4 py-3 w-12"></th>
                  <th className="px-4 py-3">Position Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Hiring Manager</th>
                  <th className="px-4 py-3">Date Requested</th>
                  <th className="px-4 py-3">Approving Officer</th>
                  <th className="px-4 py-3 text-center w-16">Pipeline</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
                        checked={selected.includes(idx)}
                        onChange={() =>
                          setSelected((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]))
                        }
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{item.title}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 whitespace-nowrap rounded-full font-medium ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.manager}</div>
                      <div className="text-gray-500">{item.department}</div>
                    </td>
                    <td className="px-4 py-3">{item.date}</td>
                    <td className="px-4 py-3">{item.approver}</td>
                    <td className="px-4 py-3 text-center">
                      {item.status === "Pending" && item.approvalPipeline ? (
                        <ApprovalPipelineDropdown pipeline={item.approvalPipeline} />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      {/* Cancel Request Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-800">Cancel Request</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Are you sure you want to cancel the selected pending requests?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              No, Keep
            </Button>
            <Button variant="destructive" onClick={handleCancelRequest}>
              Cancel request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
