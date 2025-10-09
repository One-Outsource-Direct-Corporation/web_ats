"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/reusables/Navbar"

const applicants = [
  {
    name: "Michael Taylor",
    email: "michael.taylor@email.com",
    avatar: "https://i.pravatar.cc/80?u=1",
    status: "Failed",
    badge: "Warm",
    position: "Lead Developer",
    evaluation: "Failed",
    skills: ["Photoshop", "Illustrator", "Agile", "HTML", "CSS"],
    match: "95%",
  },
  {
    name: "Sarah White",
    email: "sarah.white@email.com",
    avatar: "https://i.pravatar.cc/80?u=2",
    status: "Passed",
    badge: "For Job Offer",
    position: "Lead Developer",
    evaluation: "Passed",
    skills: ["Photoshop", "Illustrator", "Agile"],
    match: "90%",
  },
  {
    name: "Nathan Wood",
    email: "nathan.wood@email.com",
    avatar: "https://i.pravatar.cc/80?u=3",
    status: "Passed",
    badge: "Warm",
    position: "Software Developer",
    evaluation: "Passed",
    skills: ["HTML", "CSS", "Java", "Illustrator"],
    match: "87%",
  },
  {
    name: "Rachel Miller",
    email: "rachel.miller@email.com",
    avatar: "https://i.pravatar.cc/80?u=4",
    status: "Passed",
    badge: "For Job Offer",
    position: "Lead Developer",
    evaluation: "Passed",
    skills: ["Photoshop", "Agile"],
    match: "85%",
  },
  {
    name: "Olivia Miller",
    email: "olivia.miller@email.com",
    avatar: "https://i.pravatar.cc/80?u=5",
    status: "Failed (Final Interview)",
    badge: "Failed",
    position: "Lead Developer",
    evaluation: "Failed (Final Interview)",
    skills: ["Photoshop", "Illustrator"],
    match: "84%",
  },
]

export default function PoolApplicants() {
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    document.title = "Pool Applicants"
  }, [])

  const handleViewProfile = (applicantName: string) => {
    // Convert name to URL-friendly format (lowercase, replace spaces with hyphens)
    const urlFriendlyName = applicantName.toLowerCase().replace(/\s+/g, "-")
    // Use window.location to navigate
    window.location.href = `/job/list/applicants/${urlFriendlyName}`
  }

  const handleCancel = () => {
    setShowCancelModal(true)
  }

  const handleGoBack = () => {
    setShowCancelModal(false)
    // Navigate to previous screen
    window.history.back()
  }

  const handleCloseModal = () => {
    setShowCancelModal(false)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 mt-20">
        <div className="mx-auto max-w-none space-y-4">
          {/* Header with Cancel Button */}
          <div className="flex justify-between items-start">
            <h2 className="text-4xl font-bold text-gray-800 border-l-4 border-blue-500 pl-4">
              Pooling of all Applicants
            </h2>
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>

          {/* Filter Row - Dropdown and Search */}
          <div className="flex items-center justify-between gap-4">
            <Select>
              <SelectTrigger className="w-60 bg-white shadow-sm">
                <SelectValue placeholder="UI Designer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ui-designer">UI Designer</SelectItem>
                <SelectItem value="lead-dev">Lead Developer</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-64">
              <Input placeholder="Search Applicant Name" className="pl-10 bg-white shadow-sm" />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Subheader */}
          <h2 className="text-lg font-semibold text-gray-700">
            Top Applicants for <span className="text-blue-600">UI Designer</span>
          </h2>

          {/* Applicant Cards */}
          <div className="space-y-4 pb-20">
            {applicants.map((applicant, index) => (
              <div key={index} className="flex items-start justify-between bg-white p-4 rounded-lg shadow-sm border">
                {/* Left side */}
                <div className="flex items-start gap-4">
                  <img
                    src={applicant.avatar || "/placeholder.svg"}
                    alt={applicant.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-md font-semibold">{applicant.name}</h3>
                      {applicant.badge && (
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            applicant.badge === "Warm"
                              ? "bg-yellow-100 text-yellow-800"
                              : applicant.badge === "For Job Offer"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {applicant.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{applicant.email}</p>
                    <p className="text-sm text-gray-500">
                      Position Applied: <span className="text-gray-700">{applicant.position}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Interview Evaluation Status: <span className="text-gray-700">{applicant.evaluation}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Matched Skills: <span className="text-gray-700">{applicant.skills.join(", ")}</span>
                    </p>
                  </div>
                </div>
                {/* Right side */}
                <div className="flex flex-col items-end gap-2">
                  <p className="text-sm font-medium text-gray-700">{applicant.match} matched</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewProfile(applicant.name)}>
                      View Profile
                    </Button>
                    <Button className="bg-[#0056D2]" size="sm">
                      Email applicant
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel pooling of applicants?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Clicking "Cancel" will return you to the previous screen. No changes will be applied to the pooling.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-700 bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={handleGoBack} className="bg-blue-600 hover:bg-blue-700 text-white">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
