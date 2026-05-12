import { useEffect } from "react";
import { Clock, MessageSquare, UserCheck, Users } from "lucide-react";
import { CalendarSection } from "../components/CalendarSection";
import { MetricsSection } from "../components/MetricsSection";
import { RecruitmentSection } from "../components/RecruitmentSection";
import { InterviewsSection } from "../components/InterviewsSection";
import { useDashboard } from "../api/useDashboard";
import type { StatusType, Metric } from "../types/upcoming_events.types";

const METRIC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Job Opening": Users,
  "New Candidates": UserCheck,
  "Invited for Interview": MessageSquare,
  "Waiting for Feedbacks": Clock,
};

function mapMetrics(apiMetrics: { title: string; value: string; color: string }[]): Metric[] {
  return apiMetrics.map((m) => ({
    ...m,
    icon: METRIC_ICONS[m.title] || Users,
  }));
}

export default function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  const { data, isLoading, isError } = useDashboard();

  const getPastelColor = (color: string, opacity: number = 0.3) => {
    const colorMap: Record<string, string> = {
      "bg-blue-500": "rgba(59, 130, 246",
      "bg-green-500": "rgba(34, 197, 94",
      "bg-orange-500": "rgba(251, 146, 60",
      "bg-purple-500": "rgba(139, 92, 246",
    };

    if (colorMap[color]) {
      return `${colorMap[color]}, ${opacity})`;
    }

    return color;
  };

  const getBorderColor = (color: string) => {
    const colorMap: Record<string, string> = {
      "bg-blue-500": "#1D4ED8",
      "bg-green-500": "#10B981",
      "bg-orange-500": "#FB923C",
      "bg-purple-500": "#7C3AED",
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="text-center text-gray-500 py-12">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="text-center text-red-500 py-12">
            Failed to load dashboard data. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-2">
          <div className="lg:col-span-2 lg:row-span-1">
            <CalendarSection weekDays={data.upcoming_events.days} />
          </div>
          <div className="lg:col-span-1 lg:row-span-1">
            <MetricsSection
              metrics={mapMetrics(data.metrics)}
              getPastelColor={getPastelColor}
              getBorderColor={getBorderColor}
            />
          </div>
          <div className="lg:col-span-2 lg:row-span-1">
            <RecruitmentSection
              getStatusColor={getStatusColor}
              jobData={data.job_data}
              ongoingProcesses={data.ongoing_processes}
            />
          </div>
          <div className="lg:col-span-1 lg:row-span-1">
            <InterviewsSection interviews={data.interviews} />
          </div>
        </div>
      </div>
    </div>
  );
}
