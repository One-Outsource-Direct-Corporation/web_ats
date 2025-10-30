import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";

interface StageActionTemplateProps {
  templateType: string;
  reminderTime: string;
  onTemplateTypeChange: (value: string) => void;
  onReminderTimeChange: (value: string) => void;
}

export function StageActionTemplate({
  templateType,
  reminderTime,
  onTemplateTypeChange,
  onReminderTimeChange,
}: StageActionTemplateProps) {
  return (
    <div>
      <div className="mb-2">
        <h4 className="text-sm font-semibold text-gray-900">
          Configure Stage Action Template
        </h4>
        <p className="text-xs text-gray-600">Send Email / SMS</p>
      </div>
      <p className="text-xs text-blue-600 mb-3">
        Select the template type. Generation may take up to 2 weeks due to
        backend processing.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-700 mb-1 block">
            Set Template
          </label>
          <Select value={templateType} onValueChange={onTemplateTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select Template" disabled>
                Select Template
              </SelectItem>
              <SelectItem value="setup_panel_interview">
                Setup Panel Interview
              </SelectItem>
              <SelectItem value="setup_one_on_one_interview">
                Setup One on One Interview
              </SelectItem>
              <SelectItem value="setup_online_interview">
                Setup Online Interview
              </SelectItem>
              <SelectItem value="setup_final_interview">
                Setup Final Interview
              </SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-1 block">
            Set Reminder
          </label>
          <Input
            type="time"
            step="1"
            value={reminderTime}
            onChange={(e) => onReminderTimeChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
