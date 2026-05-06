import { useAuth } from "@/features/auth/hooks/useAuth";
import { Link } from "react-router-dom";

export const CareersHeader: React.FC = () => {
  const { user, isAuth } = useAuth();
  const isCandidate = isAuth && user?.role === "candidate";

  return (
    <header className="w-full mt-0 p-4 flex items-center justify-between bg-white shadow-md rounded-b-2xl">
      <div className="flex items-center gap-4 ml-6">
        <div className="text-2xl font-bold text-blue-600">
          <img
            src="/OODC%20logo2.png"
            alt="OODC Logo"
            className="h-24 mx-auto"
          />
        </div>
      </div>
      {isCandidate && (
        <div className="flex items-center gap-4 mr-6">
          <Link
            to="/candidate/dashboard"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Dashboard
          </Link>
        </div>
      )}
    </header>
  );
};
