import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { FolderSearch, FolderSearch2 } from "lucide-react";
import type { StatusType } from "../types/upcoming_events.types";
import type { JobData } from "../types/upcoming_events.types";
import type { OngoingProcess } from "../types/upcoming_events.types";

interface RecruitmentSectionProps {
  getStatusColor: (status: StatusType) => string;
  jobData: JobData[];
  ongoingProcesses: OngoingProcess[];
}

export function RecruitmentSection({
  getStatusColor,
  jobData,
  ongoingProcesses,
}: RecruitmentSectionProps) {
  return (
    <Card className="h-full relative">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2 -mb-5">
            <FolderSearch /> Recruitment
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-0 items-start md:items-stretch w-full">
          {/* Job Table */}
          <div className="flex-1">
            <div className="overflow-x-auto w-full">
              <Table className="table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm sm:text-base min-w-[200px]">
                      Job
                    </TableHead>
                    <TableHead className="text-sm sm:text-base min-w-[200px]">
                      <div className="flex flex-col text-center">
                        <span>Total</span>
                        <span>Candidates</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-sm sm:text-base min-w-[150px]">
                      Vacancies
                    </TableHead>
                    <TableHead className="text-sm sm:text-base min-w-[150px]">
                      Expiration
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobData.map((job, index) => (
                    <TableRow
                      key={index}
                      className="odd:bg-gray-100 even:bg-white"
                    >
                      <TableCell className="font-medium break-words min-w-[200px] whitespace-normal">
                        {job.job}
                      </TableCell>
                      <TableCell className="flex items-center gap-2 min-w-[200px] break-words whitespace-normal">
                        <FolderSearch2 />
                        {job.candidates}
                      </TableCell>
                      <TableCell className="min-w-[150px] break-words whitespace-normal">
                        {job.vacancies}
                      </TableCell>
                      <TableCell className="min-w-[150px] break-words whitespace-normal text-sm text-gray-500">
                        {job.expiration}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="hidden md:flex items-center justify-center px-2">
            <Separator
              orientation="vertical"
              className="h-full w-[1px] bg-border"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
