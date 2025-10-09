import { MetricsSection } from "./MetricsSection";
import { InterviewsSection } from "./InterviewsSection";
import type { Metric, InterviewDay } from "../types/upcomingEvents.types";

interface RightColumnProps {
  metrics: Metric[];
  interviews: InterviewDay[];
  getPastelColor: (color: string, opacity?: number) => string;
  getBorderColor: (color: string) => string;
}

export function RightColumn({
  metrics,
  interviews,
  getPastelColor,
  getBorderColor,
}: RightColumnProps) {
  return (
    <div className="space-y-6">
      <MetricsSection
        metrics={metrics}
        getPastelColor={getPastelColor}
        getBorderColor={getBorderColor}
      />
      <InterviewsSection interviews={interviews} />
    </div>
  );
}
