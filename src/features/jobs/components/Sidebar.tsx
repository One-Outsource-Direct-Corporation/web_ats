import { MoreHorizontal } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { MiniCalendar } from "./MiniCalendar";
import type { SidebarCandidate } from "../types/kanban.types";

export function Sidebar() {
  const candidates: SidebarCandidate[] = [
    {
      id: "c1",
      name: "Jane Cruise",
      title: "Senior frontend developer",
      stage: 3,
      stageColor: "orange",
      timeAgo: "5d ago",
    },
    {
      id: "c2",
      name: "Green William",
      title: "UI/UX designer & developer",
      stage: 3,
      stageColor: "red",
      timeAgo: "4h ago",
    },
    {
      id: "c3",
      name: "Daniel Goldberg",
      title: "Magna lorem consectetur",
      stage: 1,
      stageColor: "green",
      timeAgo: "1 day ago",
    },
  ];

  const getStageColorClass = (color: "orange" | "red" | "green") => {
    switch (color) {
      case "orange":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="w-full lg:w-80 bg-white lg:border-l border-gray-200 p-4 space-y-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <MiniCalendar />

      {/* Filters */}
      <div className="flex gap-2">
        <Select defaultValue="stage-01">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stage-01">Stage: 01</SelectItem>
            <SelectItem value="stage-02">Stage: 02</SelectItem>
            <SelectItem value="stage-03">Stage: 03</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="today">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Candidates List */}
      <div className="space-y-3">
        {candidates.map((candidate: SidebarCandidate) => (
          <div
            key={candidate.id}
            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${candidate.id}`}
                alt={candidate.name}
              />
              <AvatarFallback>
                {candidate.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{candidate.name}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {candidate.title}
                  </p>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStageColorClass(
                      candidate.stageColor
                    )}`}
                  >
                    Stage {candidate.stage}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">{candidate.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
