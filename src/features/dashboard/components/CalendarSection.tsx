import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Calendar, Phone } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getEventIcon } from "./EventIcon.tsx";
import { useDashboardCalendar } from "../api/useDashboardCalendar";
import { useState, useMemo } from "react";
import type { WeekDay } from "../types/upcoming_events.types";

interface CalendarSectionProps {
  weekDays: WeekDay[];
}

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getCenteredWeek(days: WeekDay[]): WeekDay[] {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const todayIndex = days.findIndex((d) => d.fullDate === todayStr);
  if (todayIndex === -1) return days.slice(0, 7);

  const start = Math.max(0, todayIndex - 3);
  const end = Math.min(days.length, todayIndex + 4);

  let result = days.slice(start, end);
  while (result.length < 7) {
    if (start === 0) {
      result.push({ day: "", date: "", events: [], fullDate: "", isCurrentDay: false, isCurrentMonth: false });
    } else {
      result.unshift({ day: "", date: "", events: [], fullDate: "", isCurrentDay: false, isCurrentMonth: false });
    }
  }
  return result;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CalendarSection({ weekDays }: CalendarSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1);
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  const { data: monthData, isLoading: calLoading } = useDashboardCalendar(calMonth, calYear);

  const centeredWeek = useMemo(() => getCenteredWeek(weekDays), [weekDays]);

  const navigateMonth = (delta: number) => {
    let newMonth = calMonth + delta;
    let newYear = calYear;
    if (newMonth > 12) { newMonth = 1; newYear++; }
    if (newMonth < 1) { newMonth = 12; newYear--; }
    setCalMonth(newMonth);
    setCalYear(newYear);
  };

  const rows: WeekDay[][] = [];
  const monthDays = monthData?.days ?? [];
  for (let i = 0; i < monthDays.length; i += 7) {
    rows.push(monthDays.slice(i, i + 7));
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Events
          <div className="ml-auto">
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Full Calendar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold min-w-[160px] text-center inline-block">
                        {monthData?.month ?? MONTHS[calMonth - 1]} {calYear}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <Select
                      value={String(calMonth)}
                      onValueChange={(v) => {
                        const newMonth = parseInt(v);
                        if (calYear === new Date().getFullYear() && newMonth > new Date().getMonth() + 3) return;
                        setCalMonth(newMonth);
                      }}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((name, idx) => (
                          <SelectItem key={idx} value={String(idx + 1)}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </DialogTitle>
                </DialogHeader>
                {calLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
                        {DAY_HEADERS.map((day) => (
                          <div key={day} className="bg-gray-100 px-2 py-2 text-center text-xs font-semibold text-gray-600">
                            {day}
                          </div>
                        ))}
                        {rows.map((row, rowIndex) =>
                          row.map((day, colIndex) => (
                            <div
                              key={`${rowIndex}-${colIndex}`}
                              className={`min-h-[90px] bg-white px-1.5 py-1.5 ${
                                day.isCurrentMonth ? "" : "bg-gray-50"
                              } ${day.isCurrentDay ? "ring-2 ring-blue-500 ring-inset" : ""}`}
                            >
                              <div
                                className={`text-xs font-medium mb-1 ${
                                  day.isCurrentDay
                                    ? "bg-blue-500 text-white w-5 h-5 flex items-center justify-center rounded-full"
                                    : day.isCurrentMonth
                                      ? "text-gray-900"
                                      : "text-gray-400"
                                }`}
                              >
                                {day.date}
                              </div>
                              <div className="space-y-1">
                                {day.events.slice(0, 2).map((event, idx) => (
                                  <div key={idx} className="flex items-center gap-1 text-[10px] leading-tight">
                                    <Avatar className="w-4 h-4 flex-shrink-0">
                                      <AvatarImage src={event.avatar} alt={event.candidate} />
                                      <AvatarFallback className="text-[8px]">
                                        {event.candidate.split(" ")[0]?.[0] ?? ""}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="truncate text-gray-700">
                                      {event.candidate.split(" ")[0]}
                                    </span>
                                    <span className="flex-shrink-0">{getEventIcon(event.type)}</span>
                                  </div>
                                ))}
                                {day.events.length > 2 && (
                                  <div className="text-[10px] text-blue-600 font-medium pl-1">
                                    +{day.events.length - 2} more
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mt-4">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-blue-500" />
                          <span>Phone Interview</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-green-500" />
                          <span>Initial Interview</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-red-500" />
                          <span>Final Interview</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 lg:space-x-6">
            {centeredWeek.map((day, index) => (
              <div
                key={index}
                className={`flex flex-col items-center w-28 border rounded-lg p-2 ${
                  day.isCurrentDay ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                <div className="text-xs font-medium text-gray-500">
                  {day.isCurrentDay ? "Today" : day.day}
                </div>
                <div className={`text-sm font-medium ${day.isCurrentDay ? "text-blue-600" : "text-gray-900"}`}>
                  {day.date}
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {day.events.length > 0 ? (
                    day.events.map((event, idx) => (
                      <div key={idx} className="flex items-center space-x-1">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={event.avatar} alt={event.candidate} />
                          <AvatarFallback>
                            {event.candidate.split(" ")[0]?.[0] ?? ""}
                          </AvatarFallback>
                        </Avatar>
                        <div className="w-4 h-4">{getEventIcon(event.type)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400">No Events</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-start lg:justify-center space-x-4 text-xs text-gray-500 mt-6">
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4 text-blue-500" />
              <span>Phone Interview</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4 text-green-500" />
              <span>Initial Interview</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4 text-red-500" />
              <span>Final Interview</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
