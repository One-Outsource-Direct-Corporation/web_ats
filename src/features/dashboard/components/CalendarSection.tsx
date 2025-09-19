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
import { Calendar, Phone, NotebookPen, ClipboardList } from "lucide-react";
import { weekDays } from "../data/weekDays";
import { getEventIcon } from "./EventIcon.tsx";

export function CalendarSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {/* Container for the calendar and legend */}
          <div className="flex flex-col lg:space-y-4">
            {/* Calendar Grid: Horizontal for desktop */}
            <div className="flex space-x-4 lg:space-x-6">
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center w-28 border border-gray-300 rounded-lg p-2"
                >
                  <div className="text-xs font-medium text-gray-500">
                    {day.day}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {day.date}
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {day.events.length > 0 ? (
                      day.events.map((event, idx) => (
                        <div key={idx} className="flex items-center space-x-1">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={event.avatar}
                              alt={`Avatar for ${event.candidate}`}
                            />
                            <AvatarFallback>
                              {event.candidate.split(" ")[0][0]}{" "}
                              {/* This shows the first letter of the first name */}
                            </AvatarFallback>
                          </Avatar>
                          <div className="w-4 h-4">
                            {getEventIcon(event.type)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400">No Events</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend Below the Calendar */}
            <div className="flex flex-wrap justify-start lg:justify-center space-x-4 text-xs text-gray-500 mt-6">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>Phone Interview</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4 text-red-500" />
                <span>Final Phone Interview</span>
              </div>
              <div className="flex items-center space-x-1">
                <NotebookPen className="w-4 h-4 text-yellow-500" />
                <span>Assessment</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClipboardList className="w-4 h-4 text-purple-500" />
                <span>Task Test</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
