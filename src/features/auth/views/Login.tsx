import React from "react";
import LoginForm from "../components/LoginForm";
import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDefaultLandingPage } from "../utils/rolePermissions";
import { Briefcase } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  const isCandidateFlow = location.state?.role === "candidate";

  useEffect(() => {
    document.title = isCandidateFlow ? "Candidate Login" : "Log In";
  }, [isCandidateFlow]);

  useEffect(() => {
    if (user) {
      // If there's an explicit redirect target, use it; otherwise go to role-based default
      const from = location.state?.from;
      const explicitPath = typeof from === "string" ? from : from?.pathname;
      const target = explicitPath || getDefaultLandingPage(user.role);
      navigate(target, { replace: true });
    }
  }, [user, navigate, location.state]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Main */}
      <div className="flex flex-col md:flex-row flex-grow min-h-0 bg-gray-50">
        {/* Title and Logo */}
        <div className="w-full md:w-[45%] bg-white p-6 flex flex-col justify-center items-center flex-shrink-0">
          <img
            src="/OODC%20logo2.png"
            alt="OODC Logo"
            className="w-60 sm:w-72 md:w-96 lg:w-[30rem] xl:w-[36rem] mb-6"
          />
        </div>

        {/* Login Form Area */}
        <div className="w-full md:w-[55%] bg-gray-100 flex items-center justify-center px-6 sm:px-8 py-10">
          <div className="w-full max-w-2xl relative z-10">
            {isCandidateFlow && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 font-medium text-sm">
                    Applying for a position?
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    Log in with your candidate account to continue your application.{" "}
                    <Link
                      to="/candidate/register"
                      className="font-semibold underline hover:text-blue-800"
                    >
                      Create an account
                    </Link>{" "}
                    if you do not have one.
                  </p>
                </div>
              </div>
            )}
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white text-center py-2 text-sm text-gray-700 shadow-md mt-auto">
        © 2024 Outsource Direct Corporation |{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
      </footer>
    </div>
  );
};

export default Login;
