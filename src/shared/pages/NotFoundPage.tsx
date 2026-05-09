import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
          <FileQuestion className="h-10 w-10 text-[#0056d2]" />
        </div>
        <h1 className="text-7xl font-bold text-[#0056d2] mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-[#0056d2] hover:bg-blue-700 text-white px-6"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
