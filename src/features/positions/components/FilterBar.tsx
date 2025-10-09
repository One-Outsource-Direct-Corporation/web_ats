import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select.tsx";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { User, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FilterBar() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <Input placeholder="Search positions..." className="w-64" />
      <div className="flex flex-wrap gap-2 ml-auto">
        <Select>
          <SelectTrigger className="min-w-[160px] bg-gray-100">
            <SelectValue placeholder="All Offices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Offices</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="min-w-[160px] bg-gray-100">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="min-w-[160px] bg-gray-100">
            <SelectValue placeholder="All Employment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employment Type</SelectItem>
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              Add New Position
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-blue-700 text-sm text-center font-semibold">
                SELECT TYPE OF HIRING
              </DialogTitle>
              <DialogDescription hidden aria-hidden>
                Choose between Internal Hiring or Client
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center gap-12 mt-6">
              {/* Internal Hiring */}
              <div
                className="flex flex-col items-center space-y-2 cursor-pointer group"
                onClick={() => navigate("/prf")}
              >
                <div className="w-16 h-16 rounded-full border border-gray-500 text-gray-600 flex items-center justify-center group-hover:border-blue-500 group-hover:text-blue-500">
                  <User className="w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600 font-medium group-hover:text-blue-500">
                  Internal Hiring
                </span>
              </div>

              {/* Client */}
              <div
                className="flex flex-col items-center space-y-2 cursor-pointer group"
                onClick={() => navigate("/positions/create-new-position")}
              >
                <div className="w-16 h-16 rounded-full border border-gray-500 text-gray-600 group-hover:border-blue-500 group-hover:text-blue-500 flex items-center justify-center">
                  <Users2 className="w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600 group-hover:text-blue-500 font-medium">
                  Client
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default FilterBar;
