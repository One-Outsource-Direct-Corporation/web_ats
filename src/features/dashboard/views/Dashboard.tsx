import { useEffect } from "react";
import { metrics } from "../data/metrics";
import { interviews } from "../data/interviews";
import { LeftColumn } from "../components/LeftColumn";
import { RightColumn } from "../components/RightColumn";
import type { StatusType } from "../types/upcoming_events.types";

export default function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  const getPastelColor = (color: string, opacity: number = 0.3) => {
    const colorMap: Record<string, string> = {
      "bg-blue-500": "rgba(59, 130, 246", // Blue
      "bg-green-500": "rgba(34, 197, 94", // Green
      "bg-orange-500": "rgba(251, 146, 60", // Orange
      "bg-purple-500": "rgba(139, 92, 246", // Purple
    };

    if (colorMap[color]) {
      return `${colorMap[color]}, ${opacity})`;
    }

    return color; // If not found, return the color as is
  };

  const getBorderColor = (color: string) => {
    const colorMap: Record<string, string> = {
      "bg-blue-500": "#1D4ED8", // Blue border
      "bg-green-500": "#10B981", // Green border
      "bg-orange-500": "#FB923C", // Orange border
      "bg-purple-500": "#7C3AED", // Purple border
    };

    return colorMap[color] || color;
  };

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "Interview":
        return "bg-blue-100 text-blue-800";
      case "Assessment":
        return "bg-yellow-100 text-yellow-800";
      case "Offer Sent":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="relative bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <LeftColumn getStatusColor={getStatusColor} />
            <RightColumn
              metrics={metrics}
              interviews={interviews}
              getPastelColor={getPastelColor}
              getBorderColor={getBorderColor}
            />
          </div>
        </div>
      </div>
    </>
  );
}
