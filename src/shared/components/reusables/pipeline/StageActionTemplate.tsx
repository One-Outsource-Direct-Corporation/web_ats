import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StageActionTemplateProps {
  reminderTime: string;
  onReminderTimeChange: (value: string) => void;
}

export function StageActionTemplate({
  reminderTime,
  onReminderTimeChange,
}: StageActionTemplateProps) {
  const [templateType, setTemplateType] = useState("");
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [reminderTimeOnly, setReminderTimeOnly] = useState("");

  // Parse the reminderTime prop into date and time components
  useEffect(() => {
    if (reminderTime) {
      // If reminderTime is in ISO format or datetime-local format (YYYY-MM-DDTHH:mm)
      if (reminderTime.includes("T")) {
        const [dateStr, time] = reminderTime.split("T");
        setReminderDate(new Date(dateStr));
        setReminderTimeOnly(time.substring(0, 5)); // Get HH:mm
      } else if (reminderTime.includes(" ")) {
        // If format is "YYYY-MM-DD HH:mm:ss" or similar
        const [dateStr, time] = reminderTime.split(" ");
        setReminderDate(new Date(dateStr));
        setReminderTimeOnly(time.substring(0, 5)); // Get HH:mm
      } else if (reminderTime.includes(":")) {
        // If it's just a time string (HH:mm or HH:mm:ss)
        setReminderTimeOnly(reminderTime.substring(0, 5));
        setReminderDate(undefined);
      } else {
        // If it's just a date string (YYYY-MM-DD)
        setReminderDate(new Date(reminderTime));
        setReminderTimeOnly("");
      }
    } else {
      // Clear both fields if reminderTime is empty
      setReminderDate(undefined);
      setReminderTimeOnly("");
    }
  }, [reminderTime]);

  // Combine date and time and update parent
  const handleDateChange = (date: Date | undefined) => {
    setReminderDate(date);
    if (date && reminderTimeOnly) {
      const dateStr = format(date, "yyyy-MM-dd");
      onReminderTimeChange(`${dateStr}T${reminderTimeOnly}`);
    } else if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      onReminderTimeChange(dateStr);
    } else {
      // If date is cleared, clear the entire reminder
      onReminderTimeChange("");
    }
  };

  const handleTimeChange = (time: string) => {
    setReminderTimeOnly(time);
    if (reminderDate && time) {
      const dateStr = format(reminderDate, "yyyy-MM-dd");
      onReminderTimeChange(`${dateStr}T${time}`);
    } else if (time) {
      // Only time provided, just store the time
      onReminderTimeChange(time);
    } else {
      // If time is cleared, clear the entire reminder
      onReminderTimeChange("");
    }
  };

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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-700 mb-1 block">
            Set Template
          </label>
          <Select value={templateType} onValueChange={setTemplateType}>
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
            Reminder Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !reminderDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {reminderDate ? (
                  format(reminderDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
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
            onChange={(e) => handleTimeChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
