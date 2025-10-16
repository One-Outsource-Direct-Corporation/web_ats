import { Button } from "@/shared/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import { Trash2, Archive, Pause, RotateCcw, Unlock } from "lucide-react";
import type { TabType } from "../types/positionTypes";
import { getBulkActions } from "../utils/positionsUtils";

interface BulkActionsProps {
  currentTab: TabType;
  selectedCount: number;
  onAction: (action: string) => void;
}

const iconMap = {
  Trash2,
  Archive,
  Pause,
  RotateCcw,
  Unlock,
};

export default function BulkActions({
  currentTab,
  selectedCount,
  onAction,
}: BulkActionsProps) {
  const actions = getBulkActions(currentTab);

  if (selectedCount === 0 || actions.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {actions.map((action) => {
          const IconComponent = iconMap[action.icon as keyof typeof iconMap];

          return (
            <Tooltip key={action.action}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    action.destructive
                      ? "text-red-600 hover:bg-red-50"
                      : "text-blue-600 hover:bg-blue-50"
                  }
                  onClick={() => onAction(action.action)}
                >
                  <IconComponent className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
