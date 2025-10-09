import { CalendarSection } from "./CalendarSection";
import { RecruitmentSection } from "./RecruitmentSection";
import type { StatusType } from "../types/upcomingEvents.types";

interface LeftColumnProps {
  getStatusColor: (status: StatusType) => string;
}

export function LeftColumn({ getStatusColor }: LeftColumnProps) {
  return (
    <div className="space-y-6 lg:col-span-2">
      <CalendarSection />
      <RecruitmentSection getStatusColor={getStatusColor} />
    </div>
  );
}
