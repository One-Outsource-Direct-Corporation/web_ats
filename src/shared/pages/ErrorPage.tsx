import { useNavigate, useRouteError } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();
  console.error("Route error:", error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="px-6"
          >
            Reload Page
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="bg-[#0056d2] hover:bg-blue-700 text-white px-6"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
