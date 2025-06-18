import { Navbar } from "@/reusables/Navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { ChevronRight } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"


// tab title
export default function Applicants() {
    useEffect(() => {
    document.title = "Applicants";
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 p-6 pt-[100px]">
        <div className="mx-auto max-w-7xl space-y-4">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800">Applicants</h1>

          {/* Filters */}
          <div className="w-full space-y-2">
            {/* Clear filters */}
            <div className="flex justify-end mb-2">
              <a className="text-medium text-blue-500 hover:underline">
                Clear filters
              </a>
            </div>

            {/* Search bar and filters */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              {/* Search bar */}
              <Input
                placeholder="Search applicants..."
                className="w-64"
              />

              {/* Filter dropdowns */}
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

          {/* Applicants Table */}
          <div className="mt-6 overflow-x-auto rounded-md border bg-white">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr className="text-xs text-muted-foreground uppercase">
                  <th className="px-6 py-4 font-medium">Applicants</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Position applying for</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Employment Type</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  {
                    name: "Maria White",
                    status: "Hired",
                    position: "Project Manager",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=1",
                  },
                  {
                    name: "Carmen Martinez",
                    status: "Failed",
                    position: "Social Media Manager",
                    department: "Marketing",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=2",
                  },
                  {
                    name: "Olivia Miller",
                    status: "Warm",
                    position: "Senior UI/UX Designer",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=3",
                  },
                  {
                    name: "Jessica Gonzalez",
                    status: "Hired",
                    position: "Lead Developer",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=4",
                  },
                  {
                    name: "Rachel Miller",
                    status: "Hired",
                    position: "Lead Developer",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=5",
                  },
                  {
                    name: "Olivia Miller",
                    status: "For Interview",
                    position: "Lead Developer",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=6",
                  },
                  {
                    name: "Nathan Wood",
                    status: "For Interview",
                    position: "QA Engineer",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=7",
                  },
                  {
                    name: "Sarah White",
                    status: "For Job Offer",
                    position: "QA Engineer",
                    department: "CI",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=8",
                  },
                  {
                    name: "Michael Taylor",
                    status: "Onboarding",
                    position: "Operations Manager",
                    department: "HR",
                    type: "Full Time",
                    avatar: "https://i.pravatar.cc/40?u=9",
                  },
                ].map((applicant, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Link
                        to="/applicantinformation"
                        className="flex items-center gap-3 hover:underline text-blue-600"
                      >
                      <img
                        src={applicant.avatar}
                        alt={applicant.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{applicant.name}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          applicant.status === "Hired"
                            ? "bg-green-100 text-green-800"
                            : applicant.status === "Failed"
                            ? "bg-red-100 text-red-800"
                            : applicant.status === "Warm"
                            ? "bg-yellow-100 text-yellow-800"
                            : applicant.status === "For Interview"
                            ? "bg-orange-100 text-orange-800"
                            : applicant.status === "For Job Offer"
                            ? "bg-blue-100 text-blue-800"
                            : applicant.status === "Onboarding"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{applicant.position}</td>
                    <td className="px-6 py-4">{applicant.department}</td>
                    <td className="px-6 py-4">{applicant.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer buttons */}
            <div className="flex justify-between items-center px-6 py-3 border-t bg-gray-50">
              <Button
                variant="default"
                size="sm"
                style={{ backgroundColor: "#0056D2", color: "white" }}
              >
                Pool Applicant
              </Button>
              <div className="mt-6">
        <button
          onClick={() => navigate("/applicants/jobdetails")}
          className="flex items-center text-blue-500 text-sm hover:underline"
        >
          Next
          <ChevronRight className="w-4 h-4 mr-1" />
        </button>
      </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
