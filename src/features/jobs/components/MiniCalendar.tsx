import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { DayObject, WeekDayObject } from "../types/kanban.types";

export function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1)); // February 2025
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getDaysInMonth = (date: Date): DayObject[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
    const days: DayObject[] = [];

    // Previous month days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day;
      days.push({
        day,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  const getCurrentWeek = (date: Date): WeekDayObject[] => {
    const referenceDate = new Date(date);
    const dayOfWeek = (referenceDate.getDay() + 6) % 7;
    const currentWeekStart = new Date(referenceDate);
    currentWeekStart.setDate(referenceDate.getDate() - dayOfWeek);

    const today = new Date();
    const weekDays: WeekDayObject[] = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);

      weekDays.push({
        day: day.getDate(),
        month: day.getMonth(),
        year: day.getFullYear(),
        isCurrentMonth: day.getMonth() === referenceDate.getMonth(),
        isToday: day.toDateString() === today.toDateString(),
        fullDate: new Date(day),
      });
    }

    return weekDays;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === "weekly") {
        if (direction === "prev") {
          newDate.setDate(prev.getDate() - 7);
        } else {
          newDate.setDate(prev.getDate() + 7);
        }
      } else {
        if (direction === "prev") {
          newDate.setMonth(prev.getMonth() - 1);
        } else {
          newDate.setMonth(prev.getMonth() + 1);
        }
      }
      return newDate;
    });
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      {/* View Toggle */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setViewMode("weekly")}
          className={`px-3 py-1 text-xs rounded border
            ${
              viewMode === "weekly"
                ? "bg-[#0056d2] text-white border-[#0056d2]"
                : "bg-white text-[#0056d2] border-[#0056d2]"
            }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setViewMode("monthly")}
          className={`px-3 py-1 text-xs rounded border
            ${
              viewMode === "monthly"
                ? "bg-[#0056d2] text-white border-[#0056d2]"
                : "bg-white text-[#0056d2] border-[#0056d2]"
            }`}
        >
          Monthly
        </button>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      {viewMode === "weekly" ? (
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 p-2"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getCurrentWeek(currentDate).map((day, index) => (
              <div
                key={index}
                className={`
                  text-center text-sm p-2 cursor-pointer rounded hover:bg-gray-100
                  ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                  ${
                    day.isToday
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : ""
                  }
                `}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1 mb-4">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 p-2"
            >
              {day}
            </div>
          ))}
          {getDaysInMonth(currentDate).map((day, index) => (
            <div
              key={index}
              className={`
                text-center text-sm p-2 cursor-pointer rounded hover:bg-gray-100
                ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                ${day.isToday ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
              `}
            >
              {day.day}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
