"use client"
import { useParams } from "react-router-dom"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  MapPin,
  Users,
  Clock,
  Grid3X3,
  List,
  Maximize2,
  Star,
  Check,
  X,
} from "lucide-react"

import { Navbar } from "@/reusables/Navbar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// ----------------------
// Interfaces
// ----------------------

interface Applicant {
  id: string
  name: string
  time: string
  avatar?: string
  rating: number
}

interface StageColumnProps {
  title: string
  id: string
  applicants: Applicant[]
  count: number
  isSelectionMode: boolean
  hasSelectedApplicants: boolean
  onColumnClick: (columnId: string) => void
}

interface ApplicantCardProps {
  id: string
  name: string
  time: string
  avatar?: string
  rating: number
  isDragging?: boolean
  isSelected?: boolean
  isSelectionMode?: boolean
  onLongPress?: (id: string) => void
  onToggleSelect?: (id: string) => void
}

interface SidebarCandidate {
  id: string
  name: string
  title: string
  stage: number
  stageColor: "orange" | "red" | "green"
  timeAgo: string
}

interface DayObject {
  day: number
  isCurrentMonth: boolean
  isToday: boolean
}

interface WeekDayObject {
  day: number
  month: number
  year: number
  isCurrentMonth: boolean
  isToday: boolean
  fullDate: Date
}

interface StageSectionProps {
  title: string
  columns: { title: string; id: string }[]
  applicantColumns: { [key: string]: Applicant[] }
  isMultiRow?: boolean
  selectedApplicants: Set<string>
  isSelectionMode: boolean
  onLongPress: (id: string) => void
  onToggleSelect: (id: string) => void
  onColumnClick: (columnId: string) => void
  navigate: any
  jobtitle?: string // Add this line
}

// ----------------------
// ApplicantCard Component
// ----------------------

function ApplicantCard({
  id,
  name,
  time,
  rating,
  isDragging = false,
  isSelected = false,
  isSelectionMode = false,
  onLongPress,
  onToggleSelect,
}: ApplicantCardProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 150ms ease",
    opacity: sortableIsDragging ? 0.5 : 1,
  }

  const handleTouchStart = () => {
    if (!isMobile || !onLongPress) return

    const timer = setTimeout(() => {
      onLongPress(id)
    }, 500) // 500ms long press

    setLongPressTimer(timer)
  }

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  const handleClick = () => {
    if (isMobile && isSelectionMode && onToggleSelect) {
      onToggleSelect(id)
    } else if (isMobile && !isSelectionMode && onLongPress) {
      // Allow single tap to start selection if not in selection mode
      // This provides an alternative to long press
      onLongPress(id)
    }
  }

  const cardProps = isMobile
    ? {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        onClick: handleClick,
      }
    : {
        ...attributes,
        ...listeners,
      }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...cardProps}
      className={`
        bg-white p-3 rounded-lg border mb-2 transition-all duration-200
        ${!isMobile ? "cursor-move hover:shadow-md" : "cursor-pointer"}
        ${isDragging ? "rotate-1 shadow-lg" : ""}
        ${sortableIsDragging ? "z-50" : ""}
        ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""}
        ${isSelectionMode && !isSelected ? "opacity-70" : ""}
      `}
    >
      <div className="flex items-center gap-3">
        {isMobile && isSelectionMode && (
          <div
            className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"}
          `}
          >
            {isSelected && <Check className="h-3 w-3 text-white" />}
          </div>
        )}

        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${id}`} alt={name} />
          <AvatarFallback className="text-xs">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate">{name}</p>
          <div className="flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">{time}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ----------------------
// DroppableColumn Component
// ----------------------

function DroppableColumn({
  title,
  id,
  applicants,
  count,
  isSelectionMode,
  hasSelectedApplicants,
  onColumnClick,
  navigate,
  jobtitle, // Add this prop
}: StageColumnProps & { navigate: any; jobtitle?: string }) {
  const [isMobile, setIsMobile] = useState(false)
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleColumnClick = () => {
    if (isMobile && isSelectionMode && hasSelectedApplicants) {
      onColumnClick(id)
    }
  }

  const handleMaximizeClick = () => {
    // Create a mapping from stage titles to route segments
    const stageRouteMapping: Record<string, string> = {
      "Resume Screening": "resumescreening",
      "Phone-Call Interview": "phonecallinterview",
      "Initial Interview": "initialinterview",
      Shortlisted: "shortlisted",
      Assessment: "assessments",
      "Final Interview": "finalinterview",
      "For Job Offer": "forjoboffer",
      "Job Offer & Finalization": "forjoboffer", // You might want a different route for this
      Onboarding: "onboarding",
      Warm: "warm",
      Failed: "failed",
    }

    const routeSegment = stageRouteMapping[title]
    if (routeSegment) {
      // Get the current job title from the URL params or use a default
      const currentJobTitle = jobtitle || "leaddeveloper"
      navigate(`/applicants/job/${currentJobTitle}/${routeSegment}`)
    }
  }

  return (
    <div className="w-full lg:w-[280px] lg:flex-shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleMaximizeClick}>
          <Maximize2 className="h-3 w-3" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        onClick={handleColumnClick}
        className={`
          border rounded-lg min-h-[300px] p-3 transition-colors duration-200
          ${isOver ? "bg-blue-50 border-blue-300" : "bg-gray-50"}
          ${isMobile && isSelectionMode && hasSelectedApplicants ? "cursor-pointer hover:bg-green-50 hover:border-green-300" : ""}
          ${isMobile && isSelectionMode && hasSelectedApplicants ? "ring-2 ring-green-200" : ""}
        `}
      >
        {isMobile && isSelectionMode && hasSelectedApplicants && (
          <div className="mb-3 p-2 bg-green-100 rounded-lg text-center">
            <p className="text-xs text-green-800 font-medium">Tap to move selected applicants here</p>
          </div>
        )}

        <SortableContext items={applicants.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {applicants.map((applicant) => (
            <ApplicantCard key={applicant.id} {...applicant} />
          ))}
        </SortableContext>
        {applicants.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            {isMobile && isSelectionMode && hasSelectedApplicants ? "Tap to move here" : "Drop applicants here"}
          </div>
        )}
      </div>
    </div>
  )
}

// ----------------------
// Calendar Component
// ----------------------

function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1)) // February 2025
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly")

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const getDaysInMonth = (date: Date): DayObject[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Adjust for Monday start

    const days: DayObject[] = []

    // Previous month days
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false,
      })
    }

    // Current month days
    const today = new Date()
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
      days.push({
        day,
        isCurrentMonth: true,
        isToday,
      })
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
      })
    }

    return days
  }

  const getCurrentWeek = (date: Date): WeekDayObject[] => {
    // Use the passed date instead of always using today
    const referenceDate = new Date(date)
    const dayOfWeek = (referenceDate.getDay() + 6) % 7 // Adjust for Monday start
    const currentWeekStart = new Date(referenceDate)
    currentWeekStart.setDate(referenceDate.getDate() - dayOfWeek)

    const today = new Date()
    const weekDays: WeekDayObject[] = []

    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart)
      day.setDate(currentWeekStart.getDate() + i)

      weekDays.push({
        day: day.getDate(),
        month: day.getMonth(),
        year: day.getFullYear(),
        isCurrentMonth: day.getMonth() === referenceDate.getMonth(),
        isToday: day.toDateString() === today.toDateString(),
        fullDate: new Date(day),
      })
    }

    return weekDays
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (viewMode === "weekly") {
        // Navigate by week
        if (direction === "prev") {
          newDate.setDate(prev.getDate() - 7)
        } else {
          newDate.setDate(prev.getDate() + 7)
        }
      } else {
        // Navigate by month
        if (direction === "prev") {
          newDate.setMonth(prev.getMonth() - 1)
        } else {
          newDate.setMonth(prev.getMonth() + 1)
        }
      }
      return newDate
    })
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      {/* View Toggle */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setViewMode("weekly")}
          className={`px-3 py-1 text-xs rounded border 
            ${
              viewMode === "weekly"
                ? "bg-white text-[#0056d2] border-[#0056d2]"
                : "bg-[#0056d2] text-white border-[#0056d2]"
            }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setViewMode("monthly")}
          className={`px-3 py-1 text-xs rounded border 
            ${
              viewMode === "monthly"
                ? "bg-white text-[#0056d2] border-[#0056d2]"
                : "bg-[#0056d2] text-white border-[#0056d2]"
            }`}
        >
          Monthly
        </button>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      {viewMode === "weekly" ? (
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getCurrentWeek(currentDate).map((day, index) => (
              <div
                key={index}
                className={`
                  text-center text-sm p-2 cursor-pointer rounded hover:bg-gray-100
                  ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                  ${day.isToday ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                `}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
          {getDaysInMonth(currentDate).map((day, index) => (
            <div
              key={index}
              className={`
                text-center text-sm p-2 cursor-pointer rounded hover:bg-gray-100
                ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                ${day.isToday ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
              `}
            >
              {day.day}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ----------------------
// Sidebar Component
// ----------------------

function Sidebar() {
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
    <div className="w-full lg:w-80 bg-white lg:border-l border-gray-200 p-4 lg:pt-[100px] pt-6 space-y-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <MiniCalendar />

      {/* Filters */}
      <div className="flex gap-2">
        <Select defaultValue="stage-01">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stage-01">Stage: 01</SelectItem>
            <SelectItem value="stage-02">Stage: 02</SelectItem>
            <SelectItem value="stage-03">Stage: 03</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="today">
          <SelectTrigger className="w-full">
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
      <div className="space-y-3">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${candidate.id}`} alt={candidate.name} />
              <AvatarFallback>{candidate.name.split(" ").map((n) => n[0])}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{candidate.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{candidate.title}</p>
                  <Badge variant="outline" className={`text-xs ${getStageColorClass(candidate.stageColor)}`}>
                    Stage {candidate.stage}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">{candidate.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ----------------------
// Stage Section Component
// ----------------------

function StageSection({
  title,
  columns,
  applicantColumns,
  isMultiRow = false,
  selectedApplicants,
  isSelectionMode,
  onLongPress,
  onToggleSelect,
  onColumnClick,
  navigate,
  jobtitle,
}: StageSectionProps) {
  if (isMultiRow && columns.length === 5) {
    // Special layout for Stage 3 with 5 columns
    const firstRow = columns.slice(0, 3) // First 3 columns
    const secondRow = [
      { title: "Warm", id: "warm" },
      { title: "Failed", id: "failed" },
    ] // Last 2 columns

    return (
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <div className="h-1 w-16 bg-blue-500 rounded"></div>
        </div>

        {/* First row - 3 columns */}
        <div className="flex flex-col lg:flex-row gap-6 lg:overflow-x-auto pb-4 mb-6">
          {firstRow.map((column) => (
            <DroppableColumn
              key={column.id}
              title={column.title}
              id={column.id}
              applicants={
                applicantColumns[column.id]?.map((applicant) => ({
                  ...applicant,
                  isSelected: selectedApplicants.has(applicant.id),
                  isSelectionMode,
                  onLongPress,
                  onToggleSelect,
                })) || []
              }
              count={(applicantColumns[column.id] || []).length}
              isSelectionMode={isSelectionMode}
              hasSelectedApplicants={selectedApplicants.size > 0}
              onColumnClick={onColumnClick}
              navigate={navigate}
              jobtitle={jobtitle} // Add this line
            />
          ))}
        </div>

        {/* Second row - 2 columns */}
        <div className="flex flex-col lg:flex-row gap-6 lg:overflow-x-auto pb-4">
          {secondRow.map((column) => (
            <DroppableColumn
              key={column.id}
              title={column.title}
              id={column.id}
              applicants={
                applicantColumns[column.id]?.map((applicant) => ({
                  ...applicant,
                  isSelected: selectedApplicants.has(applicant.id),
                  isSelectionMode,
                  onLongPress,
                  onToggleSelect,
                })) || []
              }
              count={(applicantColumns[column.id] || []).length}
              isSelectionMode={isSelectionMode}
              hasSelectedApplicants={selectedApplicants.size > 0}
              onColumnClick={onColumnClick}
              navigate={navigate}
              jobtitle={jobtitle} // Add this line
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="h-1 w-16 bg-blue-500 rounded"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:overflow-x-auto pb-4">
        {columns.map((column) => (
          <DroppableColumn
            key={column.id}
            title={column.title}
            id={column.id}
            applicants={
              applicantColumns[column.id]?.map((applicant) => ({
                ...applicant,
                isSelected: selectedApplicants.has(applicant.id),
                isSelectionMode,
                onLongPress,
                onToggleSelect,
              })) || []
            }
            count={(applicantColumns[column.id] || []).length}
            isSelectionMode={isSelectionMode}
            hasSelectedApplicants={selectedApplicants.size > 0}
            onColumnClick={onColumnClick}
            navigate={navigate}
            jobtitle={jobtitle} // Add this line
          />
        ))}
      </div>
    </div>
  )
}

// ----------------------
// Main Component
// ----------------------

export default function LeadDeveloperWeekly() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // All stage data combined
  const [allColumns, setAllColumns] = useState<{
    [key: string]: Applicant[]
  }>({
    // Stage 1 columns
    "resume-screening": [
      { id: "1", name: "Rosa Bumbay", time: "1h ago", rating: 0 },
      { id: "2", name: "Maria Batumbakal", time: "1h ago", rating: 0 },
      { id: "5", name: "Jhonny Bravo", time: "3h ago", rating: 0 },
      { id: "6", name: "RJ Oremimo", time: "Dec 3", rating: 0 },
      { id: "7", name: "Sung Jin Woo", time: "Dec 1", rating: 0 },
    ],
    "phone-call": [
      { id: "3", name: "Joseph Adams", time: "7h ago", rating: 0 },
      { id: "8", name: "Brian Martinez", time: "1d ago", rating: 0 },
      { id: "9", name: "Sarah Johnson", time: "Nov 30", rating: 0 },
      { id: "10", name: "Sarah Davis", time: "Nov 28", rating: 0 },
    ],
    shortlisted: [
      { id: "4", name: "Joseph Adams", time: "2d ago", rating: 0 },
      { id: "11", name: "Brian Martinez", time: "Nov 29", rating: 0 },
      { id: "12", name: "Sarah Johnson", time: "Nov 30", rating: 0 },
      { id: "13", name: "Sarah Davis", time: "Nov 28", rating: 0 },
    ],
    // Stage 2 columns
    "initial-interview": [
      { id: "s2-1", name: "Joseph Santos", time: "1h ago", rating: 0 },
      { id: "s2-2", name: "Virla Getalado", time: "1h ago", rating: 0 },
    ],
    assessment: [{ id: "s2-3", name: "Kyle Maybury", time: "1h ago", rating: 0 }],
    "final-interview": [
      { id: "s2-4", name: "Joseph Adams", time: "7h ago", rating: 0 },
      { id: "s2-5", name: "Brian Martinez", time: "5h ago", rating: 0 },
      { id: "s2-6", name: "Sarah Johnson", time: "Nov 30", rating: 0 },
      { id: "s2-7", name: "Sarah Davis", time: "Nov 28", rating: 0 },
    ],
    // Stage 3 columns
    "job-offer": [
      { id: "s3-1", name: "Kyle Maybury", time: "1h ago", rating: 0 },
      { id: "s3-2", name: "Clara Lopez", time: "1h ago", rating: 0 },
      { id: "s3-3", name: "John Clark", time: "4h ago", rating: 0 },
      { id: "s3-4", name: "John Clark", time: "Dec 5", rating: 0 },
      { id: "s3-5", name: "Brian Harris", time: "Dec 1", rating: 0 },
    ],
    "job-offer-finalization": [
      { id: "s3-6", name: "Kyle Maybury", time: "1h ago", rating: 0 },
      { id: "s3-7", name: "Clara Lopez", time: "1h ago", rating: 0 },
      { id: "s3-8", name: "John Clark", time: "4h ago", rating: 0 },
    ],
    onboarding: [
      { id: "s3-9", name: "Joseph Adams", time: "7h ago", rating: 0 },
      { id: "s3-10", name: "Brian Martinez", time: "5h ago", rating: 0 },
      { id: "s3-11", name: "Sarah Johnson", time: "Nov 30", rating: 0 },
      { id: "s3-12", name: "Sarah Davis", time: "Nov 28", rating: 0 },
    ],
    warm: [
      { id: "s3-13", name: "Christian Edwards", time: "1h ago", rating: 0 },
      { id: "s3-14", name: "Clara Lopez", time: "1h ago", rating: 0 },
      { id: "s3-15", name: "John Clark", time: "4h ago", rating: 0 },
    ],
    failed: [
      { id: "s3-16", name: "Joseph Adams", time: "1h ago", rating: 0 },
      { id: "s3-17", name: "Brian Martinez", time: "3h ago", rating: 0 },
      { id: "s3-18", name: "Sarah Johnson", time: "Nov 30", rating: 0 },
    ],
  })

  useEffect(() => {
    document.title = "Applicants"
  }, [])

  const findContainer = (id: string) => {
    if (id in allColumns) {
      return id
    }

    return Object.keys(allColumns).find((key) => allColumns[key].find((item) => item.id === id))
  }

  const getActiveApplicant = () => {
    if (!activeId) return null

    for (const items of Object.values(allColumns)) {
      const applicant = items.find((item) => item.id === activeId)
      if (applicant) return applicant
    }
    return null
  }

  const handleLongPress = (applicantId: string) => {
    if (!isSelectionMode) {
      // Start selection mode with this applicant
      setIsSelectionMode(true)
      setSelectedApplicants(new Set([applicantId]))
    } else {
      // Already in selection mode, toggle this applicant
      handleToggleSelect(applicantId)
    }
  }

  const handleToggleSelect = (applicantId: string) => {
    const newSelected = new Set(selectedApplicants)
    if (newSelected.has(applicantId)) {
      newSelected.delete(applicantId)
    } else {
      newSelected.add(applicantId)
    }
    setSelectedApplicants(newSelected)

    if (newSelected.size === 0) {
      setIsSelectionMode(false)
    }
  }

  const handleColumnClick = (targetColumnId: string) => {
    if (selectedApplicants.size === 0) return

    const newColumns = { ...allColumns }
    const selectedApplicantsList: Applicant[] = []

    // Remove selected applicants from their current columns
    Object.keys(newColumns).forEach((columnId) => {
      newColumns[columnId] = newColumns[columnId].filter((applicant) => {
        if (selectedApplicants.has(applicant.id)) {
          selectedApplicantsList.push(applicant)
          return false
        }
        return true
      })
    })

    // Add selected applicants to target column
    newColumns[targetColumnId] = [...newColumns[targetColumnId], ...selectedApplicantsList]

    setAllColumns(newColumns)
    setSelectedApplicants(new Set())
    setIsSelectionMode(false)
  }

  const handleClearSelection = () => {
    setSelectedApplicants(new Set())
    setIsSelectionMode(false)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer) return

    if (activeContainer === overContainer) return

    const activeItems = allColumns[activeContainer]
    const overItems = allColumns[overContainer]

    const activeIndex = activeItems.findIndex((item) => item.id === activeId)
    const activeItem = activeItems[activeIndex]

    if (!activeItem) return

    setAllColumns({
      ...allColumns,
      [activeContainer]: activeItems.filter((item) => item.id !== activeId),
      [overContainer]: [...overItems, activeItem],
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer) return

    if (activeContainer === overContainer) {
      const items = allColumns[activeContainer]
      const oldIndex = items.findIndex((item) => item.id === activeId)
      const newIndex = items.findIndex((item) => item.id === overId)

      if (oldIndex !== newIndex) {
        const newItems = [...items]
        const [removed] = newItems.splice(oldIndex, 1)
        newItems.splice(newIndex, 0, removed)

        setAllColumns({
          ...allColumns,
          [activeContainer]: newItems,
        })
      }
    }
  }

  const activeApplicant = getActiveApplicant()
  const totalApplicants = Object.values(allColumns).reduce((sum, col) => sum + col.length, 0)

  const stageConfigs = [
    {
      title: "STAGE 01 - HR Interview",
      columns: [
        { title: "Resume Screening", id: "resume-screening" },
        { title: "Phone-Call Interview", id: "phone-call" },
        { title: "Shortlisted", id: "shortlisted" },
      ],
      isMultiRow: false,
    },
    {
      title: "STAGE 02 - Hiring Manager/Client",
      columns: [
        { title: "Initial Interview", id: "initial-interview" },
        { title: "Assessment", id: "assessment" },
        { title: "Final Interview", id: "final-interview" },
      ],
      isMultiRow: false,
    },
    {
      title: "STAGE 03",
      columns: [
        { title: "For Job Offer", id: "job-offer" },
        { title: "Job Offer & Finalization", id: "job-offer-finalization" },
        { title: "Onboarding", id: "onboarding" },
        { title: "Warm", id: "warm" },
        { title: "Failed", id: "failed" },
      ],
      isMultiRow: true,
    },
  ]

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        {/* Mobile Selection Bar */}
        {isSelectionMode && (
          <div className="lg:hidden fixed top-16 left-0 right-0 bg-blue-600 text-white p-3 z-50 flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedApplicants.size} applicant{selectedApplicants.size !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-75">Tap column to move</span>
              <Button variant="ghost" size="sm" onClick={handleClearSelection} className="text-white hover:bg-blue-700">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 p-6 lg:pr-0 ${isSelectionMode ? "pt-[140px] lg:pt-[100px]" : "pt-[100px]"}`}>
          <div className="mx-auto max-w-none space-y-6 lg:mr-6">
            {/* Header */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900 text-center sm:text-left">{resolvedJobTitle}</h2>

                <Select defaultValue="active">
                  <SelectTrigger className="w-auto min-w-[80px] bg-green-100 text-green-800 border-green-300 hover:bg-green-200">
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
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Full time</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Dec 9</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Onsite</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Total applicant: {totalApplicants}</span>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded border 
                  ${
                    viewMode === "grid"
                      ? "bg-white text-[#0056d2] border-[#0056d2]"
                      : "bg-[#0056d2] text-white border-[#0056d2]"
                  }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  setViewMode("list")
                  navigate("/applicants/jobdetails/leaddeveloper/")
                }}
                className={`p-2 rounded border 
    ${viewMode === "list" ? "bg-white text-[#0056d2] border-[#0056d2]" : "bg-[#0056d2] text-white border-[#0056d2]"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Instructions */}
            {!isSelectionMode && (
              <div className="lg:hidden bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Mobile tip:</strong> Long press on any applicant to start selection mode. Then long press
                  additional applicants to select multiple, and tap a column to move them all there.
                </p>
              </div>
            )}

            {/* Drag and Drop Context for all stages */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              {/* All Stages Stacked Vertically */}
              <div className="space-y-8">
                {stageConfigs.map((stage, index) => (
                  <StageSection
                    key={index}
                    title={stage.title}
                    columns={stage.columns}
                    applicantColumns={allColumns}
                    isMultiRow={stage.isMultiRow}
                    selectedApplicants={selectedApplicants}
                    isSelectionMode={isSelectionMode}
                    onLongPress={handleLongPress}
                    onToggleSelect={handleToggleSelect}
                    onColumnClick={handleColumnClick}
                    navigate={navigate}
                    jobtitle={jobtitle} // Add this line
                  />
                ))}
              </div>

              <DragOverlay>
                {activeApplicant ? <ApplicantCard {...activeApplicant} isDragging={true} /> : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>

        {/* Right Sidebar */}
        <Sidebar />
      </div>
    </>
  )
}
