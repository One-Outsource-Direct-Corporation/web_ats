import { useMemo } from "react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import type {
  PipelineEmailTriggerOutcome,
  PipelineStepNotificationTemplate,
} from "@/shared/types/pipeline.types";
import { useEmailTemplatesQuery } from "@/features/library/hooks/useEmailTemplatesQuery";

interface StageActionTemplateProps {
  notificationTemplates: PipelineStepNotificationTemplate[];
  onNotificationTemplatesChange: (
    value: PipelineStepNotificationTemplate[],
  ) => void;
  passedEmailTemplateId?: number | null;
  failedEmailTemplateId?: number | null;
  onPassedEmailTemplateChange?: (id: number | null) => void;
  onFailedEmailTemplateChange?: (id: number | null) => void;
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
  notificationTemplates,
  onNotificationTemplatesChange,
  passedEmailTemplateId,
  failedEmailTemplateId,
  onPassedEmailTemplateChange,
  onFailedEmailTemplateChange,
}: StageActionTemplateProps) {
  const normalizedTemplates = useMemo(
    () => ensureTemplates(notificationTemplates),
    [notificationTemplates],
  );

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

  const { templates: emailTemplates } = useEmailTemplatesQuery({ pageSize: 50 });

  const handleTemplateSelect = (
    triggerOutcome: PipelineEmailTriggerOutcome,
    value: string,
  ) => {
    const id = value === "__none" ? null : Number(value);

    if (id !== null) {
      const selectedTemplate = emailTemplates.find((template: any) => template.id === id);
      if (selectedTemplate) {
        onNotificationTemplatesChange(
          normalizedTemplates.map((template) => {
            if (template.trigger_outcome !== triggerOutcome) {
              return template;
            }

            return {
              ...template,
              action_type: "send_email",
              subject: selectedTemplate.subject ?? "",
              body: selectedTemplate.body ?? "",
            };
          }),
        );
      }
    }

    if (triggerOutcome === "passed") {
      onPassedEmailTemplateChange?.(id);
    } else {
      onFailedEmailTemplateChange?.(id);
    }
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
        Configure the email content sent when a candidate passes or fails this
        step.
      </p>

      <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        SMS is reserved for a later release. This template currently stores
        Send Email content only.
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
                <label className="text-sm text-gray-700 mb-1 block">Template (optional)</label>
                <Select
                  value={
                    template.trigger_outcome === "passed"
                      ? String(passedEmailTemplateId ?? "__none")
                      : String(failedEmailTemplateId ?? "__none")
                  }
                  onValueChange={(val) => handleTemplateSelect(template.trigger_outcome, val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select email template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">None</SelectItem>
                    {emailTemplates.map((t: any) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
