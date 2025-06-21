
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Upload } from "lucide-react"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"


export default function InterviewEvaluationForm() {
  const [formData, setFormData] = useState({
    applicantName: "",
    interviewDate: "",
    positionApplyingFor: "",
    interviewer: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    // Handle form submission logic here
  }

  const handlePass = () => {
    console.log("Applicant passed")
    // Handle pass logic here
  }

  const handleFail = () => {
    console.log("Applicant failed")
    // Handle fail logic here
  }

  const handleLiveRecord = () => {
    console.log("Starting live recording")
    // Handle live recording logic here
  }

  const handleUploadFile = () => {
    console.log("Opening file upload")
    // Handle file upload logic here
  }

  const navigate = useNavigate()

  return (
    <>
      
      <div className="min-h-screen bg-gray-50 p-6 mt-20">
        <div className="mx-auto max-w-4xl">
          {/* Header Section */}
<div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
  {/* Back + Title Section */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-center sm:text-left w-full sm:w-auto">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className="self-center sm:self-auto text-blue-600 hover:bg-blue-50 px-2"
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      Back
    </Button>
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Evaluation Form</h1>
      <div className="w-full h-1 bg-blue-500 rounded"></div>
    </div>
  </div>

  {/* Pass/Fail Buttons */}
  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center">
    <Button
      onClick={handlePass}
      variant="outline"
      className="border-green-500 text-green-600 hover:bg-green-50 px-6 w-full sm:w-auto"
    >
      Pass
    </Button>
    <Button
      onClick={handleFail}
      variant="outline"
      className="border-red-500 text-red-600 hover:bg-red-50 px-6 w-full sm:w-auto"
    >
      Fail
    </Button>
  </div>
</div>


          {/* Form Content */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8">
              {/* First Row - Applicant Name and Interview Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="applicantName" className="text-sm font-medium text-gray-700">
                    Applicant Name
                  </Label>
                  <Input
                    id="applicantName"
                    value={formData.applicantName}
                    onChange={(e) => handleInputChange("applicantName", e.target.value)}
                    placeholder="Enter applicant name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interviewDate" className="text-sm font-medium text-gray-700">
                    Interview Date
                  </Label>
                  <Input
                    id="interviewDate"
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) => handleInputChange("interviewDate", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Second Row - Position and Interviewer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="positionApplyingFor" className="text-sm font-medium text-gray-700">
                    Position Applying for
                  </Label>
                  <Input
                    id="positionApplyingFor"
                    value={formData.positionApplyingFor}
                    onChange={(e) => handleInputChange("positionApplyingFor", e.target.value)}
                    placeholder="Enter position"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interviewer" className="text-sm font-medium text-gray-700">
                    Interviewer
                  </Label>
                  <Input
                    id="interviewer"
                    value={formData.interviewer}
                    onChange={(e) => handleInputChange("interviewer", e.target.value)}
                    placeholder="Enter interviewer name"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Record or Upload File Section */}
              <div className="mb-8">
  <h2 className="text-xl font-semibold text-gray-900 mb-3">
    Record or Upload File
  </h2>
  <p className="text-gray-600 mb-6 leading-relaxed">
    Our AI will analyze the interview, summarize key points, and help you assess the applicant—saving your
    time and effort.
  </p>

  {/* Center the buttons only */}
  <div className="flex justify-center">
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        onClick={handleLiveRecord}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center gap-2"
      >
        <Mic className="h-4 w-4" />
        Live Record
      </Button>
      <Button
        onClick={handleUploadFile}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Upload File
      </Button>
    </div>
  </div>
</div>



              {/* Add Notes Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Add Notes</h2>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Add your interview notes here..."
                  className="w-full min-h-[120px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
