import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleUser, ClockAlert, MapPin, Video, Pin } from "lucide-react";
import type { InterviewDay } from "../types/upcomingEvents.types";

interface InterviewsSectionProps {
  interviews: InterviewDay[];
}

export function InterviewsSection({ interviews }: InterviewsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Pin />
            Scheduled Interviews
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {interviews.map((day, dayIndex) => (
          <div key={dayIndex} className="space-y-4">
            {/* Day Name */}
            <h3 className="mb-2 font-semibold text-gray-900">{day.date}</h3>

            {/* Interview Sessions for the day */}
            <div className="space-y-3">
              {day.sessions.map((session, sessionIndex) => (
                <div key={sessionIndex} className="rounded-lg bg-gray-100 p-4">
                  <div className="flex items-start justify-between">
                    {/* Session Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <ClockAlert className="h-4 w-4" />
                        {session.time} • {session.type}
                      </div>
                    </div>

                    {/* Job Info and Candidate */}
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {session.job}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2 justify-end">
                        <CircleUser className="h-3 w-3" />
                        {session.candidate}
                      </div>

                      {/* Session Details */}
                      <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                        <ClockAlert className="h-3 w-3" />
                        <span>{session.duration}</span>
                        <div className="flex items-center gap-1">
                          {session.location === "Online" ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <MapPin className="h-3 w-3" />
                          )}
                          {session.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
