import { Phone, NotebookPen, ClipboardList } from "lucide-react";
import type { EventType } from "../types/upcomingEvents.types";

export function getEventIcon(type: EventType) {
  switch (type) {
    case "phone":
      return <Phone className="w-4 h-4 text-blue-500" />;
    case "phone-red":
      return <Phone className="w-4 h-4 text-red-500" />;
    case "notebookpen":
      return <NotebookPen className="w-4 h-4 text-yellow-500" />;
    case "clipboard":
      return <ClipboardList className="w-4 h-4 text-purple-500" />;
    default:
      return null;
  }
}
