import { useEffect, useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  PipelineEmailTriggerOutcome,
  PipelineStepNotificationTemplate,
} from "@/shared/types/pipeline.types";

interface StageActionTemplateProps {
  reminderTime: string;
  onReminderTimeChange: (value: string) => void;
  notificationTemplates: PipelineStepNotificationTemplate[];
  onNotificationTemplatesChange: (
    value: PipelineStepNotificationTemplate[],
  ) => void;
}

const DEFAULT_NOTIFICATION_TEMPLATES: PipelineStepNotificationTemplate[] = [
  {
    action_type: "send_email",
    trigger_outcome: "passed",
    subject: "",
    body: "",
  },
  {
    action_type: "send_email",
    trigger_outcome: "failed",
    subject: "",
    body: "",
  },
];

function ensureTemplates(
  notificationTemplates: PipelineStepNotificationTemplate[],
) {
  const passedTemplate = notificationTemplates.find(
    (template) => template.trigger_outcome === "passed",
  );
  const failedTemplate = notificationTemplates.find(
    (template) => template.trigger_outcome === "failed",
  );

  return [
    passedTemplate ?? DEFAULT_NOTIFICATION_TEMPLATES[0],
    failedTemplate ?? DEFAULT_NOTIFICATION_TEMPLATES[1],
  ];
}

export function StageActionTemplate({
  reminderTime,
  onReminderTimeChange,
  notificationTemplates,
  onNotificationTemplatesChange,
}: StageActionTemplateProps) {
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [reminderTimeOnly, setReminderTimeOnly] = useState("");

  const normalizedTemplates = useMemo(
    () => ensureTemplates(notificationTemplates),
    [notificationTemplates],
  );

  useEffect(() => {
    if (!reminderTime) {
      setReminderDate(undefined);
      setReminderTimeOnly("");
      return;
    }

    if (reminderTime.includes("T")) {
      const [dateStr, time] = reminderTime.split("T");
      setReminderDate(new Date(dateStr));
      setReminderTimeOnly(time.substring(0, 5));
      return;
    }

    if (reminderTime.includes(" ")) {
      const [dateStr, time] = reminderTime.split(" ");
      setReminderDate(new Date(dateStr));
      setReminderTimeOnly(time.substring(0, 5));
      return;
    }

    if (reminderTime.includes(":")) {
      setReminderTimeOnly(reminderTime.substring(0, 5));
      setReminderDate(undefined);
      return;
    }

    setReminderDate(new Date(reminderTime));
    setReminderTimeOnly("");
  }, [reminderTime]);

  const handleDateChange = (date: Date | undefined) => {
    setReminderDate(date);

    if (date && reminderTimeOnly) {
      onReminderTimeChange(`${format(date, "yyyy-MM-dd")}T${reminderTimeOnly}`);
      return;
    }

    if (date) {
      onReminderTimeChange(format(date, "yyyy-MM-dd"));
      return;
    }

    onReminderTimeChange("");
  };

  const handleTimeChange = (time: string) => {
    setReminderTimeOnly(time);

    if (reminderDate && time) {
      onReminderTimeChange(`${format(reminderDate, "yyyy-MM-dd")}T${time}`);
      return;
    }

    if (time) {
      onReminderTimeChange(time);
      return;
    }

    onReminderTimeChange("");
  };

  const updateTemplateField = (
    triggerOutcome: PipelineEmailTriggerOutcome,
    field: "subject" | "body",
    value: string,
  ) => {
    onNotificationTemplatesChange(
      normalizedTemplates.map((template) => {
        if (template.trigger_outcome !== triggerOutcome) {
          return template;
        }

        return {
          ...template,
          action_type: "send_email",
          [field]: value,
        };
      }),
    );
  };

  return (
    <div>
      <div className="mb-2">
        <h4 className="text-sm font-semibold text-gray-900">
          Configure Stage Action Template
        </h4>
        <p className="text-xs text-gray-600">Send Email</p>
      </div>

      <p className="text-xs text-blue-600 mb-3">
        Configure reminder timing and the email content sent when a candidate
        passes or fails this step.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div>
          <label className="text-sm text-gray-700 mb-1 block">
            Reminder Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !reminderDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {reminderDate ? format(reminderDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={reminderDate}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-1 block">
            Reminder Time
          </label>
          <Input
            type="time"
            value={reminderTimeOnly}
            onChange={(event) => handleTimeChange(event.target.value)}
          />
        </div>

        <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          SMS is reserved for a later release. This template currently stores
          Send Email content only.
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {normalizedTemplates.map((template) => (
          <div key={template.trigger_outcome} className="rounded-lg border p-4">
            <div className="mb-3">
              <h5 className="text-sm font-semibold text-gray-900 capitalize">
                {template.trigger_outcome} Email
              </h5>
              <p className="text-xs text-gray-500">
                Sent when the candidate {template.trigger_outcome === "passed" ? "passes" : "fails"} this pipeline step.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Subject
                </label>
                <Input
                  value={template.subject}
                  onChange={(event) =>
                    updateTemplateField(
                      template.trigger_outcome,
                      "subject",
                      event.target.value,
                    )
                  }
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Body
                </label>
                <Textarea
                  value={template.body}
                  onChange={(event) =>
                    updateTemplateField(
                      template.trigger_outcome,
                      "body",
                      event.target.value,
                    )
                  }
                  placeholder="Enter email body"
                  style={{ minHeight: 140 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
