import { useApplicants } from "../hooks/useApplicants";
import { ApplicantList } from "../components/ApplicantList";
import { Input } from "@/shared/components/ui/input.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select.tsx";
import { ChevronRightCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Applicants() {
  useEffect(() => {
    document.title = "Applicants";
  }, []);
  const navigate = useNavigate();
  const applicants = useApplicants();

  return (
    <div>
      <div className="fixed top-[64px] left-0 right-0 z-30 bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
        <div className="max-w-7xl mx-auto -space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Applicants</h1>
          <p className="text-lg text-gray-700 mt-5">
            Stores candidate details and tracks their application progress.
          </p>
          <div className="flex justify-end">
            <button className="text-sm text-blue-500 hover:underline cursor-pointer pb-2">
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
      <div className="min-h-screen bg-gray-50 px-6 pt-[270px] pb-[80px]">
        <div className="mx-auto max-w-7xl w-full">
          <div className="overflow-x-auto rounded-lg border bg-white">
            <ApplicantList applicants={applicants} />
          </div>
        </div>
      </div>
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
    </div>
  );
}
