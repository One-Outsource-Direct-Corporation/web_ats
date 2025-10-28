import { Card, CardContent } from "@/shared/components/ui/card";
import type { Metric } from "../types/upcoming_events.types";

interface MetricsSectionProps {
  metrics: Metric[];
  getPastelColor: (color: string, opacity?: number) => string;
  getBorderColor: (color: string) => string;
}

export function MetricsSection({
  metrics,
  getPastelColor,
  getBorderColor,
}: MetricsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className="p-4"
          style={{
            backgroundColor: `${getPastelColor(metric.color)}`,
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {/* Icon with a thicker border */}
              <div
                className={`rounded-lg p-2 border-4 ${getPastelColor(
                  metric.color
                )}`}
                style={{
                  backgroundColor: `${getPastelColor(metric.color, 0.2)}`, // More transparent for the icon background
                  borderColor: `${getBorderColor(metric.color)}`, // Dynamic border color based on the background
                  borderRadius: "9999px", // Optional: to make sure the border is rounded
                }}
              >
                <metric.icon className="h-4 w-4 text-white" />
              </div>
              {/* Text Section */}
              <div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-gray-500">{metric.title}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
