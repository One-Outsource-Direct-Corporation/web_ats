import { LocationSelectionSection } from "../application/LocationSelectionSection";
import type { LocationPublicSummary } from "../../types/jobApply.types";

interface StepLocationProps {
  locations: LocationPublicSummary[];
  selectedLocationId: number | null;
  onLocationSelect: (locationId: number | null) => void;
}

export default function StepLocation({
  locations,
  selectedLocationId,
  onLocationSelect,
}: StepLocationProps) {
  return (
    <LocationSelectionSection
      locations={locations}
      selectedLocationId={selectedLocationId}
      onLocationSelect={onLocationSelect}
    />
  );
}
