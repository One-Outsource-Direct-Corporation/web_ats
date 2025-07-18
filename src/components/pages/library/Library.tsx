"use client"

import { useState, useEffect, cloneElement } from "react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/reusables/Navbar"
import {
  Users,
  Building2,
  Trash2,
  FolderIcon,
  MailIcon,
  UserIcon,
  FileTextIcon,
  Plus,
  CheckSquare,
  LayoutGrid,
  List,
  ArrowLeft,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function Library() {
  const navigate = useNavigate()
  // Use a path array to track navigation history
  const [path, setPath] = useState<("home" | "internal" | "external" | "forms")[]>(["home"])
  const currentView = path[path.length - 1] // The current active view
  const [selectedForms, setSelectedForms] = useState<string[]>([])
  const [formsViewType, setFormsViewType] = useState<"grid" | "list">("grid")
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false)

  useEffect(() => {
    document.title = "Library"
  }, [])

  const folderStroke = 1
  const iconStroke = 1.5

  const sharedFolders = [
    {
      label: "Forms",
      folderColor: "text-gray-800 group-hover:text-blue-600",
      icon: <FileTextIcon className="text-gray-800 group-hover:text-blue-600" />,
      textColor: "text-gray-800 group-hover:text-blue-600",
      onClick: () => setPath((prev) => [...prev, "forms"]), // Navigate to forms view
    },
    {
      label: "Email Templates",
      folderColor: "text-gray-800 group-hover:text-blue-600",
      icon: <MailIcon className="text-gray-800 group-hover:text-blue-600" />,
      textColor: "text-gray-800 group-hover:text-blue-600",
      onClick: () => console.log("Email Templates clicked"), // Placeholder for actual navigation
    },
    {
      label: "Applicants",
      folderColor: "text-gray-800 group-hover:text-blue-600",
      icon: <UserIcon className="text-gray-800 group-hover:text-blue-600" />,
      textColor: "text-gray-800 group-hover:text-blue-600",
      onClick: () => console.log("Applicants clicked"), // Placeholder for actual navigation
    },
  ]

  const forms = ["Personnel Requisition Form (PRF)", "Open Position (For External Client)", "Interview Evaluation Form"]

  const toggleFormSelection = (formName: string) => {
    setSelectedForms((prev) =>
      prev.includes(formName) ? prev.filter((name) => name !== formName) : [...prev, formName],
    )
  }

  const handleFormClick = (formName: string) => {
    if (formName === "Personnel Requisition Form (PRF)") {
      navigate("/prf")
    }
    if (formName === "Open Position (For External Client)") {
      navigate("/positions/create-new-position")
    }
    if (formName === "Interview Evaluation Form") {
      navigate("/ieform")
    } else {
      toggleFormSelection(formName)
    }
  }

  const handleArchive = () => {
    console.log("Archived forms:", selectedForms)
    setSelectedForms([])
    setIsArchiveDialogOpen(false)
  }

  const isFolderView = currentView === "internal" || currentView === "external"

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-[100px] bg-gray-50"> {/* Added pt for fixed header */}
        {/* Fixed top header section */}
        <div className="fixed top-[64px] left-0 right-0 z-20 bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
          <div className="max-w-7xl mx-auto -space-y-2">
            <h1 className="text-3xl font-bold text-gray-800 pb-12">Library</h1> {/* Always display Library heading */}
            {path.length > 1 && ( // Show back button if not on the home view
              <div className="flex items-center mb-4">
                <Button
                  variant="ghost"
                  onClick={() => setPath((prev) => prev.slice(0, -1))} // Go back one level
                  className="text-gray-600 hover:text-blue-600 px-2 py-1 -ml-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            )}
          </div>
        </div>

        <main className="flex-grow px-6 pt-[120px] pb-[80px] max-w-7xl mx-auto w-full"> {/* Adjusted pt for main content */}
          <div className="flex items-start justify-between py-4">
            {/* Home View */}
            {currentView === "home" ? (
              <div className="flex space-x-10">
                <div
                  onClick={() => setPath((prev) => [...prev, "internal"])} // Navigate to internal view
                  className="flex flex-col items-center cursor-pointer group transition"
                >
                  <Users className="text-gray-800 group-hover:text-blue-600 w-7 h-7 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 mt-2">Internal</span>
                </div>

                <div
                  onClick={() => setPath((prev) => [...prev, "external"])} // Navigate to external view
                  className="flex flex-col items-center cursor-pointer group transition"
                >
                  <Building2 className="text-gray-800 group-hover:text-blue-600 w-7 h-7 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 mt-2">
                    External Client
                  </span>
                </div>
              </div>
            ) : isFolderView ? (
              <div className="flex space-x-10">
                {sharedFolders.map((folder, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2 group">
                    <div className="cursor-pointer transition-transform hover:scale-105" onClick={folder.onClick}>
                      <div className="relative w-16 h-16">
                        <FolderIcon className={`${folder.folderColor} w-full h-full`} strokeWidth={folderStroke} />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          {cloneElement(folder.icon, {
                            strokeWidth: iconStroke,
                            className: `${folder.icon.props.className} w-5 h-5`,
                          })}
                        </div>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${folder.textColor}`}>{folder.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              // Forms View
              <div className="w-full">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">Forms</h2>

                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-sm">View by:</span>
                    <button
                      onClick={() => setFormsViewType("grid")}
                      className={`p-1 rounded ${
                        formsViewType === "grid" ? "bg-gray-200 text-gray-800" : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFormsViewType("list")}
                      className={`p-1 rounded ${
                        formsViewType === "list" ? "bg-gray-200 text-gray-800" : "hover:bg-gray-100"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    {selectedForms.length > 0 && (
                      <div
                        onClick={() => setIsArchiveDialogOpen(true)}
                        className="flex items-center space-x-1 text-blue-600 cursor-pointer hover:underline"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Archive</span>
                      </div>
                    )}
                    <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      <Plus className="w-4 h-4" />
                      <span>Add Form</span>
                    </button>
                  </div>
                </div>

                {/* Forms List */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-3">
                    {forms.map((form, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-3 rounded-lg cursor-pointer ${
                          selectedForms.includes(form) ? "bg-blue-50" : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleFormClick(form)}
                      >
                        <div
                          className={`w-5 h-5 border rounded flex items-center justify-center mr-3 ${
                            selectedForms.includes(form) ? "bg-blue-600 border-blue-600" : "border-gray-400"
                          }`}
                        >
                          {selectedForms.includes(form) && (
                            <CheckSquare className="w-3 h-3 text-white" strokeWidth={3} />
                          )}
                        </div>
                        <span className="text-gray-800">{form}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isFolderView && (
              <div className="flex items-center space-x-1 text-blue-600 cursor-pointer hover:underline transition">
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Archive Folder</span>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Archive Confirmation Dialog */}
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Archive {selectedForms.length > 1 ? "Files" : "File"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 text-left">
            Are you sure you want to archive {selectedForms.length > 1 ? "these files" : "this file"}?
          </p>
          <DialogFooter className="justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setIsArchiveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleArchive}>
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
