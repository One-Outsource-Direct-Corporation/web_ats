import React from "react";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { getDepartmentColor } from "../utils/departmentColor";

export interface PositionCardProps {
  posting: any;
  selected: boolean;
  onSelect: () => void;
  rightContent?: React.ReactNode;
}

const PositionCard: React.FC<PositionCardProps> = ({
  posting,
  selected,
  onSelect,
  rightContent,
}) => (
  <Card className="p-4 shadow-sm hover:shadow-md transition border rounded-md">
    <div className="flex justify-between items-start">
      <div className="flex items-start gap-4 sm:gap-6">
        <div className="pt-1">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
            checked={selected}
            onChange={onSelect}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-800">
              {posting.title}
            </h3>
            <Badge
              variant="secondary"
              className={`${getDepartmentColor(posting.department)} text-xs`}
            >
              {posting.department}
            </Badge>
            {posting.status && (
              <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                {posting.status}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {posting.description.length > 100
              ? posting.description.slice(0, 100) + "..."
              : posting.description}
          </p>
        </div>
      </div>
      {rightContent}
    </div>
  </Card>
);

export default PositionCard;
