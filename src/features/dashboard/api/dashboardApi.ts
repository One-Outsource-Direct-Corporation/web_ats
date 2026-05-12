import type { AxiosInstance } from "axios";
import type { Metric, InterviewDay, JobData, OngoingProcess, CalendarMonth } from "../types/upcoming_events.types";

export interface DashboardResponse {
  metrics: Metric[];
  interviews: InterviewDay[];
  job_data: JobData[];
  ongoing_processes: OngoingProcess[];
  upcoming_events: CalendarMonth;
}

export const getDashboard = async (axiosPrivate: AxiosInstance) => {
  const response = await axiosPrivate.get<DashboardResponse>("/api/dashboard/me/");
  return response.data;
};

export const getDashboardCalendar = async (
  axiosPrivate: AxiosInstance,
  month: number,
  year: number,
) => {
  const response = await axiosPrivate.get<CalendarMonth>("/api/dashboard/calendar/", {
    params: { month, year },
  });
  return response.data;
};
