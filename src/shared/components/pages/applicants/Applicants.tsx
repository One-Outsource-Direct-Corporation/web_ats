"use client"

import { Navbar } from "@/components/reusables/Navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { ChevronRightCircle } from "lucide-react"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"


export default function Applicants() {
  useEffect(() => {
    document.title = "Applicants"
  }, [])

  const navigate = useNavigate()

  const statusColor = {
    Hired: "bg-green-100 text-green-800",
    Failed: "bg-red-100 text-red-800",
    Warm: "bg-yellow-100 text-yellow-800",
    "For Interview": "bg-orange-100 text-orange-800",
    "For Job Offer": "bg-blue-100 text-blue-800",
    Onboarding: "bg-purple-100 text-purple-800",
    // Add other statuses as needed
  }

  return (
    <>
      <Navbar />

      {/* Fixed Header Section */}
      <div className="fixed top-[64px] left-0 right-0 z-30 bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
        <div className="max-w-7xl mx-auto -space-y-2">

            <h1 className="text-3xl font-bold text-gray-800">Applicants</h1>
            <p className="text-lg text-gray-700 mt-5">Stores candidate details and tracks their application progress.</p>
            <div className="flex justify-end">
              <button
                
                className="text-sm text-blue-500 hover:underline cursor-pointer pb-2"
              >
                Clear filters
              </button>
            </div>

          <div className="flex flex-wrap justify-between items-center gap-4">
            <Input placeholder="Search applicants..." className="w-64" />

            <div className="flex flex-wrap gap-2 ml-auto">
              {[
                "All Internal",
                "All Status",
                "All Job Position",
                "All Departments",
                "Employment Type",
              ].map((label) => (
                <Select key={label}>
                  <SelectTrigger className="min-w-[160px] bg-gray-100">
                    <SelectValue placeholder={label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{label}</SelectItem>
                  </SelectContent>
                </Select>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content (with top padding to offset fixed header) */}
      <div className="min-h-screen bg-gray-50 px-6 pt-[270px] pb-[80px]">
        <div className="mx-auto max-w-7xl w-full">
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full text-sm text-left"> {/* Changed min-w-full to w-full here */}
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Applicants</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center">
                    Position applying for
                  </th>
                  <th className="px-4 py-2 text-center">Department</th>
                  <th className="px-4 py-2 text-center">
                    Employment Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Maria White",
                    email: "maria.white@email.com",
                    status: "Hired",
                    position: "Project Manager",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=1",
                  },
                  {
                    name: "Carmen Martinez",
                    email: "carmen.martinez@email.com",
                    status: "Failed",
                    position: "Social Media Manager",
                    department: "Marketing",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=2",
                  },
                  {
                    name: "Olivia Miller",
                    email: "olivia.miller@email.com",
                    status: "Warm",
                    position: "Senior UI/UX Designer",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=3",
                  },
                  {
                    name: "Jessica Gonzalez",
                    email: "jessica.gonzalez@email.com",
                    status: "Hired",
                    position: "Lead Developer",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=4",
                  },
                  {
                    name: "Rachel Miller",
                    email: "rachel.miller@email.com",
                    status: "Hired",
                    position: "Lead Developer",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=5",
                  },
                  {
                    name: "Olivia Miller",
                    email: "olivia.miller2@email.com",
                    status: "For Interview",
                    position: "Lead Developer",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=6",
                  },
                  {
                    name: "Nathan Wood",
                    email: "nathan.wood@email.com",
                    status: "For Interview",
                    position: "QA Engineer",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=7",
                  },
                  {
                    name: "Sarah White",
                    email: "sarah.white@email.com",
                    status: "For Job Offer",
                    position: "QA Engineer",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=8",
                  },
                  {
                    name: "Michael Taylor",
                    email: "michael.taylor@email.com",
                    status: "Onboarding",
                    position: "Operations Manager",
                    department: "HR",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=9",
                  },
                ].map((applicant, index) => (
                  <tr key={index} className="border-t text-sm text-gray-800">
                    <td className="px-4 py-3">
                      <Link
                        to={`/job/list/applicants/${encodeURIComponent(
                          applicant.name.replace(/\s+/g, "-").toLowerCase()
                        )}`}
                        className="flex items-center gap-3 hover:underline hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <img
                          src={applicant.avatar || "/placeholder.svg"}
                          alt={applicant.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{applicant.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${
                          statusColor[applicant.status as keyof typeof statusColor] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{applicant.position}</td>
                    <td className="px-4 py-3 text-center">{applicant.department}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5"
                        variant="outline"
                      >
                        {applicant.type}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fixed Footer Buttons */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 z-50">
        <Button
          variant="default"
          size="sm"
          className="w-full sm:w-auto"
          style={{ backgroundColor: "#0056D2", color: "white" }}
          onClick={() => navigate("/job/list/applicants/pool")}
        >
          Pool Applicant
        </Button>

        <button
          onClick={() => navigate("/job")}
          className="text-right flex items-center text-blue-500 text-sm hover:underline"
        >
          <ChevronRightCircle className="w-4 h-4 mr-1" />
          Applicants by Position
        </button>
      </div>
    </>
  )
}
