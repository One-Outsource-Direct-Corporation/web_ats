import type { WeekDay } from "../types/upcomingEvents.types";

export const weekDays: WeekDay[] = [
  {
    day: "Mon",
    date: "15",
    events: [
      {
        event: "Interview",
        candidate: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/40?img=1",
        type: "phone",
      },
      {
        event: "Assessment",
        candidate: "Mike Chen",
        avatar: "https://i.pravatar.cc/40?img=2",
        type: "notebookpen",
      },
    ],
  },
  {
    day: "Tue",
    date: "16",
    events: [
      {
        event: "Assessment",
        candidate: "Emily Davis",
        avatar: "https://i.pravatar.cc/40?img=3",
        type: "phone-red",
      },
    ],
  },
  {
    day: "Wed",
    date: "17",
    events: [],
  },
  {
    day: "Thu",
    date: "18",
    events: [
      {
        event: "Final Interview",
        candidate: "Alex Rodriguez",
        avatar: "https://i.pravatar.cc/40?img=4",
        type: "phone-red",
      },
    ],
  },
  {
    day: "Fri",
    date: "19",
    events: [],
  },
  {
    day: "Sat",
    date: "20",
    events: [
      {
        event: "Task Test",
        candidate: "Lisa Wang",
        avatar: "https://i.pravatar.cc/40?img=5",
        type: "clipboard",
      },
    ],
  },
  {
    day: "Sun",
    date: "21",
    events: [],
  },
];
