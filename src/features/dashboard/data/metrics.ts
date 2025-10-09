import { Clock, MessageSquare, UserCheck, Users } from "lucide-react";

export const metrics = [
  { title: "Job Opening", value: "12", icon: Users, color: "bg-blue-500" },
  {
    title: "New Candidates",
    value: "89",
    icon: UserCheck,
    color: "bg-green-500",
  },
  {
    title: "Invited for Interview",
    value: "23",
    icon: MessageSquare,
    color: "bg-orange-500",
  },
  {
    title: "Waiting for Feedbacks",
    value: "7",
    icon: Clock,
    color: "bg-purple-500",
  },
];
