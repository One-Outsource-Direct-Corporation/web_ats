import { Button } from "@/shared/components/ui/button";

interface AssessmentStepProps {
  // Add any props needed for assessment configuration
}

export default function AssessmentStep({}: AssessmentStepProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Assessment Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Assessment Section */}
          <div>
            <h4 className="text-base font-medium text-gray-800 mb-4">
              Select an assessment to configure questions:
            </h4>
            <div className="space-y-3">
              <div className="border rounded-lg p-4 cursor-pointer transition-colors border-gray-300 bg-white hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-gray-600">📄</div>
                    <div>
                      <h5 className="font-medium text-gray-800">
                        Technical Assessment
                      </h5>
                      <p className="text-sm text-gray-600">
                        Online Test • Initial Interview • Required
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      ✏️
                    </Button>
                    <Button variant="ghost" size="sm">
                      🗑️
                    </Button>
                  </div>
                </div>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  Assessment configuration would be implemented here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Assessment Preview */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">
              Assessment Preview
            </h4>
            <p className="text-xs text-gray-600">
              Preview of selected assessment would appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
