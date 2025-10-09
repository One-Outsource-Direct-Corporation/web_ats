import { isAllSelected } from "../utils/positionsUtils";

interface SelectionControlsProps {
  selected: number[];
  totalItems: number;
  onSelectAll: () => void;
}

export default function SelectionControls({
  selected,
  totalItems,
  onSelectAll,
}: SelectionControlsProps) {
  const allSelected = isAllSelected(selected, totalItems);

  return (
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
          checked={allSelected}
          onChange={onSelectAll}
        />
        Select All
      </label>
    </div>
  );
}
