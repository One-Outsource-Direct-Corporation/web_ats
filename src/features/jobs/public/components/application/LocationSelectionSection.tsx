import type { LocationPublicSummary } from "../../types/jobApply.types";

interface LocationSelectionSectionProps {
  locations: LocationPublicSummary[];
  selectedLocationId: number | null;
  onLocationSelect: (locationId: number | null) => void;
}

export function LocationSelectionSection({
  locations,
  selectedLocationId,
  onLocationSelect,
}: LocationSelectionSectionProps) {
  if (!locations || locations.length === 0) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onLocationSelect(value ? Number(value) : null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Preferred Deployment Site
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Select your preferred work location for this position.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="location-select"
          className="block text-sm font-medium text-gray-700"
        >
          Location <span className="text-red-500">*</span>
        </label>
        <select
          id="location-select"
          value={selectedLocationId ?? ""}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          required
        >
          <option value="" disabled>
            -- Select a location --
          </option>
          {locations.map((loc) => {
            const isFull = loc.available <= 0;
            const label = isFull
              ? `${loc.name} (Full — ${loc.booked}/${loc.headcount})`
              : `${loc.name} (${loc.available} slot${loc.available !== 1 ? "s" : ""} remaining)`;
            return (
              <option key={loc.id} value={loc.id} disabled={isFull}>
                {label}
              </option>
            );
          })}
        </select>
        {selectedLocationId && (
          <p className="text-xs text-gray-400">
            Batch will be assigned by the system based on availability.
          </p>
        )}
      </div>
    </div>
  );
}
