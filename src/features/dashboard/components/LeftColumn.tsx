import { CalendarSection } from "./CalendarSection";
import { RecruitmentSection } from "./RecruitmentSection";
import type { StatusType } from "../types/upcoming_events.types";
import type { JobData, OngoingProcess, WeekDay } from "../types/upcoming_events.types";

interface LeftColumnProps {
  getStatusColor: (status: StatusType) => string;
  jobData: JobData[];
  ongoingProcesses: OngoingProcess[];
  weekDays: WeekDay[];
}

export function LeftColumn({
  getStatusColor,
  jobData,
  ongoingProcesses,
  weekDays,
}: LeftColumnProps) {
  return (
    <div className="space-y-6 lg:col-span-2">
      <CalendarSection weekDays={weekDays} />
      <RecruitmentSection
        getStatusColor={getStatusColor}
        jobData={jobData}
        ongoingProcesses={ongoingProcesses}
      />
    </div>
  );
}
