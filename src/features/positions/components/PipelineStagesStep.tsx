import { Button } from "@/shared/components/ui/button";

interface PipelineStagesStepProps {
  // Add any props needed for pipeline configuration
}

export default function PipelineStagesStep({}: PipelineStagesStepProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Pipeline Stages */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Pipeline Stages
            </h3>
            <p className="text-sm text-gray-600">
              You can customize automated stage actions for this pipeline here.
            </p>
          </div>
          <Button variant="ghost" size="sm">
            ✕
          </Button>
        </div>

        {/* Pipeline Stages Placeholder */}
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-6">
            <h4 className="text-blue-600 font-medium text-sm mb-4">
              Application Review
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                      📄
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-800">
                        Review Application
                      </div>
                      <div className="text-xs text-gray-500">Manual Review</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  Pipeline configuration would be implemented here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
