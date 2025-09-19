"use client"

import type React from "react"

import { useState } from "react"
import { Search, Briefcase, Phone, MapPin, Mail, FileText, X, Upload, Facebook, Linkedin, FileX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { useAppNavigation } from "@/hooks/use-navigation"

interface DocumentData {
  id: number
  name: string
  status?: "Submitted" | "Pending"
  file?: File | null
}

interface EventData {
  date: string
  month: string
  day: string
  title: string
  location?: string
  type: "Interview" | "Examination" | "Upload Documents"
}

export default function DocumentsPage() {
  const navigation = useAppNavigation()
  const [trackingCode, setTrackingCode] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  // New state for the return to tracker confirmation modal
  const [showReturnToTrackerModal, setShowReturnToTrackerModal] = useState(false)

  // Mock applicant data - would come from API/props in real app
  const applicantData = {
    name: "John Doe",
    jobTitle: "Lead Developer",
    phone: "+63 912 345 6789",
    location: "Makati City, Philippines",
    email: "john.doe@email.com",
    avatar: "https://i.pravatar.cc/150?img=1",
  }

  const [documents, setDocuments] = useState<DocumentData[]>([
    { id: 1, name: "Valid NBI Clearance or Police Clearance", status: "Pending" },
    { id: 2, name: "Medical Certificate", status: "Submitted" },
    { id: 3, name: "Certificate of Employment (COE) and Income" },
    { id: 4, name: "Tax Return (ITR 2316)", status: "Pending" },
    { id: 5, name: "Barangay Clearance" },
    { id: 6, name: "Photocopy of Dependents Birth Certificate (if applicable)", status: "Pending" },
    { id: 7, name: "Photocopy of Marriage Contract (if applicable)", status: "Pending" },
    { id: 8, name: "Photocopy of Birth Certificate", status: "Submitted" },
  ])

  const mockEvents: EventData[] = [
    {
      date: "25",
      month: "JAN",
      day: "25",
      title: "Online Interview",
      location: "Zoom Meeting",
      type: "Interview",
    },
    {
      date: "28",
      month: "JAN",
      day: "28",
      title: "Technical Examination",
      location: "OODC Office",
      type: "Examination",
    },
    {
      date: "30",
      month: "JAN",
      day: "30",
      title: "Submit Final Documents",
      type: "Upload Documents",
    },
  ]

  const handleSearch = () => {
    if (trackingCode.trim()) {
      // Navigate to tracker with the search code and automatically load results
      navigation.goToTracker(trackingCode)
    }
  }

  // Modified function to show the confirmation modal
  const handleReturnToTracker = () => {
    setShowReturnToTrackerModal(true)
  }

  // Function to confirm navigation to tracker
  const confirmReturnToTracker = () => {
    navigation.goToTracker("") // Navigate to tracker, potentially with an empty code or a default one
    setShowReturnToTrackerModal(false) // Close the modal after navigation
  }

  // Function to cancel navigation and close the modal
  const cancelReturnToTracker = () => {
    setShowReturnToTrackerModal(false)
  }

  const handleJobOpenings = () => {
    navigation.goToJobOpenings()
  }

  const handleDocumentClick = (document: DocumentData) => {
    setSelectedDocument(document)
  }

  const handleAddFile = () => {
    setShowUploadModal(true)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    if (selectedDocument) {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === selectedDocument.id ? { ...doc, file, status: "Submitted" as const } : doc)),
      )
      setSelectedDocument({ ...selectedDocument, file, status: "Submitted" })
    }
    setShowUploadModal(false)
  }

  const getEventTypeBadge = (type: "Interview" | "Examination" | "Upload Documents") => {
    const styles = {
      Interview: "bg-blue-100 text-blue-800",
      Examination: "bg-green-100 text-green-800",
      "Upload Documents": "bg-red-100 text-red-800",
    }
    return <span className={`px-2 py-1 rounded text-xs font-medium ${styles[type]}`}>{type}</span>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="w-full mt-0 p-4 flex items-center justify-between bg-white shadow-md rounded-b-2xl">
        <div className="flex items-center gap-4 ml-6">
          {/* Added onClick to navigate to job openings when the logo is clicked */}
          <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={handleJobOpenings}>
            <img src="/OODC logo2.png" alt="OODC Logo" className="h-24 mx-auto" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Column (70%) */}
        <div className="w-full lg:w-[70%] p-6">
          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                onClick={handleSearch}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>

              <div className="w-full sm:flex-1">
                <Input
                  placeholder="Enter your tracking code (e.g., ABC123)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <Button
                variant="outline"
                onClick={handleJobOpenings}
                className="w-full sm:w-auto text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent px-6 py-2"
              >
                Job Openings
              </Button>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold text-blue-600">Information</h2>
              <div className="flex-1 h-px bg-blue-600"></div>
            </div>

            <div className="flex items-start gap-6">
              {/* Avatar */}
              <img
                src={applicantData.avatar || "/placeholder.svg"}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />

              {/* Name and info */}
              <div className="flex flex-col">
                {/* Name */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{applicantData.name}</h3>

                {/* Info lined up horizontally */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{applicantData.jobTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{applicantData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{applicantData.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{applicantData.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-blue-600">Documents</h2>
                <div className="flex-1 h-px bg-blue-600"></div>
              </div>
            </div>

            {/* Legend and Submit Button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Submitted
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    Pending
                  </span>
                </div>
              </div>
              <div className="flex gap-2"> {/* Added a div to group the buttons */}
                <Button
                  variant="outline"
                  onClick={handleReturnToTracker}
                  className="border-blue-600 text-blue-600 bg-white hover:bg-blue-50 px-6 py-2 rounded-full"
                >
                  Return to Tracker
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">Submit</Button>
              </div>
            </div>

            {/* Documents List and Preview */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Documents List */}
              <div className="flex-1 space-y-3">
                {documents.map((document) => {
                  // Determine the text color class based on status
                  let nameColorClass = "text-black"
                  if (document.status === "Submitted") nameColorClass = "text-green-600"
                  else if (document.status === "Pending") nameColorClass = "text-yellow-600"

                  return (
                    <div
                      key={document.id}
                      onClick={() => handleDocumentClick(document)}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedDocument?.id === document.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <span className={`${nameColorClass} font-medium`}>{document.name}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Document Preview/Upload Box */}
              <div className="w-80 border border-gray-200 rounded-lg p-6 bg-gray-50">
                {selectedDocument?.file ? (
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h4 className="font-medium text-gray-900 mb-2">{selectedDocument.file.name}</h4>

                    <div className="mb-4">
                      {selectedDocument.file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(selectedDocument.file) || "/placeholder.svg"}
                          alt="Uploaded Preview"
                          className="max-h-48 mx-auto rounded border"
                        />
                      ) : selectedDocument.file.type === "application/pdf" ? (
                        <iframe
                          src={URL.createObjectURL(selectedDocument.file)}
                          title="PDF Preview"
                          className="w-full h-64 border rounded"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">
                          File uploaded: <strong>{selectedDocument.file.name}</strong>
                        </p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={handleAddFile}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      Replace File
                    </Button>
                  </div>
                ) : selectedDocument ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <FileX className="h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">It is empty here</h4>
                    <p className="text-gray-600 mb-4">Attach the required document</p>
                    <Button
                      variant="outline"
                      onClick={handleAddFile}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      + Add File
                    </Button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Select a document to view or upload</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (30%) */}
        <div className="w-full lg:w-[30%] p-6 pt-0 lg:pt-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0"
            />
          </div>

          {/* Events Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold text-blue-600">Events</h2>
              <div className="flex-1 h-px bg-blue-600"></div>
            </div>

            <div className="space-y-4">
              {mockEvents.map((event, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{event.month}</div>
                        <div className="text-2xl font-bold text-blue-600">{event.day}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                        {event.location && <p className="text-sm text-gray-600">{event.location}</p>}
                      </div>
                    </div>
                    <div className="ml-2 whitespace-nowrap">{getEventTypeBadge(event.type)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop files here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <input
                type="file"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer inline-block"
              >
                Browse Files
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowUploadModal(false)} className="px-6 py-2">
                Cancel
              </Button>
              <Button
                onClick={() => setShowUploadModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Return to Tracker Confirmation Modal */}
      {showReturnToTrackerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-bold text-blue-600 mb-6">Return to tracker?</h3>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={cancelReturnToTracker}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                No
              </Button>
              <Button
                onClick={confirmReturnToTracker}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full mx-auto h-30 mt-0 bg-blue-600 rounded-t-2xl p-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center gap-6 mb-4">
            <Facebook className="h-6 w-6 text-white" />
            <Briefcase className="h-6 w-6 text-white" />
            <Linkedin className="h-6 w-6 text-white" />
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div className="text-white text-sm">© 2025 One Outsource Direct Group • Privacy • Terms • Sitemap</div>
        </div>
      </footer>
    </div>
  )
}
