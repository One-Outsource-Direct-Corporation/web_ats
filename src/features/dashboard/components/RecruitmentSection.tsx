import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FolderSearch, FolderSearch2 } from "lucide-react";
import { jobData } from "../data/jobData";
import { ongoingProcesses } from "../data/ongoingProcesses";
import type { StatusType } from "../types/upcomingEvents.types";

interface RecruitmentSectionProps {
  getStatusColor: (status: StatusType) => string;
}

export function RecruitmentSection({
  getStatusColor,
}: RecruitmentSectionProps) {
  return (
    <Card className="h-fit relative">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2 -mb-5">
            <FolderSearch /> Recruitment
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-0 items-start md:items-stretch">
          {/* Job Table */}
          <div className="flex-1 md:max-w-[55%] md:pr-6">
            <div className="overflow-x-auto w-full">
              <Table className="table-auto w-full min-w-[450px]">
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

          {/* Ongoing Processes */}
          <div className="flex-1 space-y-4 min-h-[200px] md:min-h-[250px] md:pl-6">
            <h3 className="font-semibold text-gray-900">Ongoing Process</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {ongoingProcesses.map((process, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={process.avatar} alt={process.name} />
                      <AvatarFallback>
                        {process.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{process.name}</div>
                      <div className="text-sm text-gray-500">{process.job}</div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(process.status)}>
                    {process.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
