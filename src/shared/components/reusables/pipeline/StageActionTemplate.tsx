import { useMemo, useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Eye } from "lucide-react";
import type {
  PipelineEmailTriggerOutcome,
  PipelineStepNotificationTemplate,
} from "@/shared/types/pipeline.types";
import { useEmailTemplatesQuery } from "@/features/library/hooks/useEmailTemplatesQuery";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { renderPlaceholders } from "@/shared/utils/renderPlaceholders";
import { getProcessTypeLabel } from "./ProcessTypeIcon";
import { AvailablePlaceholders } from "./AvailablePlaceholders";

interface StageActionTemplateProps {
  notificationTemplates: PipelineStepNotificationTemplate[];
  onNotificationTemplatesChange: (
    value: PipelineStepNotificationTemplate[],
  ) => void;
  passedEmailTemplateId?: number | null;
  failedEmailTemplateId?: number | null;
  onPassedEmailTemplateChange?: (id: number | null) => void;
  onFailedEmailTemplateChange?: (id: number | null) => void;
  jobTitle?: string;
  processType?: string;
  interviewerName?: string;
  interviewerRole?: string;
}

const PASSED_BODY =
  "Dear {{ candidate_name }},\n\n" +
  "We are pleased to inform you that you have successfully completed the {{ pipeline_step_process_type_label }} for the position of {{ job_title }}. " +
  "We will be in touch with further details regarding the next steps.\n\n" +
  "Best regards,\n" +
  "{{ interviewer_name }}\n" +
  "{{ interviewer_role }}\n" +
  "{{ company_name }}";

const FAILED_BODY =
  "Dear {{ candidate_name }},\n\n" +
  "Thank you for your participation in the {{ pipeline_step_process_type_label }} for the position of {{ job_title }}. " +
  "After careful consideration, we regret to inform you that you have not been successful on this occasion.\n\n" +
  "We appreciate your interest and wish you all the best in your future endeavors.\n\n" +
  "Best regards,\n" +
  "{{ interviewer_name }}\n" +
  "{{ interviewer_role }}\n" +
  "{{ company_name }}";

const DEFAULT_NOTIFICATION_TEMPLATES: PipelineStepNotificationTemplate[] = [
  {
    action_type: "send_email",
    trigger_outcome: "passed",
    subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}",
    body: PASSED_BODY,
  },
  {
    action_type: "send_email",
    trigger_outcome: "failed",
    subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}",
    body: FAILED_BODY,
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
  jobTitle,
  processType,
  interviewerName,
  interviewerRole,
}: StageActionTemplateProps) {
  const { user } = useAuth();
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

  const companyName = user?.company?.name ?? "";

  const processTypeLabel = getProcessTypeLabel(processType ?? "");

  const previewContext = {
    job_title: jobTitle ?? "",
    pipeline_step_process_type: processType ?? "",
    pipeline_step_process_type_label: processTypeLabel,
    interviewer_name: interviewerName ?? "ATS Recruitment Team",
    interviewer_role: interviewerRole ?? "",
    company_name: companyName || "ATS Recruitment Team",
  };

  const [previewOutcome, setPreviewOutcome] = useState<PipelineEmailTriggerOutcome | null>(null);

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

  const openPreview = (outcome: PipelineEmailTriggerOutcome) => {
    setPreviewOutcome(outcome);
  };

  const closePreview = () => {
    setPreviewOutcome(null);
  };

  const previewTemplate = previewOutcome
    ? normalizedTemplates.find((t) => t.trigger_outcome === previewOutcome)
    : null;

  const previewSubject = previewTemplate
    ? renderPlaceholders(
        previewTemplate.subject || "{{ pipeline_step_process_type_label }} - {{ job_title }}",
        previewContext,
      )
    : "";

  const previewBody = previewTemplate
    ? renderPlaceholders(
        previewTemplate.body || "",
        { ...previewContext, candidate_name: "{{ candidate_name }}", applicant_name: "{{ applicant_name }}", outcome: previewTemplate.trigger_outcome },
      )
    : "";

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

      <div className="mt-4">
        <AvailablePlaceholders context="outcome" />
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
                  className="h-40 overflow-y-auto resize-none"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => openPreview(template.trigger_outcome)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview {template.trigger_outcome} Email
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={previewOutcome !== null} onOpenChange={(open) => { if (!open) closePreview(); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {previewOutcome} Email Preview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h6 className="text-sm font-semibold text-gray-500 mb-1">Subject</h6>
              <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900">
                {previewSubject || <span className="text-gray-400 italic">No subject configured.</span>}
              </div>
            </div>
            <div>
              <h6 className="text-sm font-semibold text-gray-500 mb-1">Body</h6>
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 whitespace-pre-wrap max-h-96 overflow-y-auto">
                {previewBody || (
                  <span className="text-gray-400 italic">
                    No body content configured.
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
