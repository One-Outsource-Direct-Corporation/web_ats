import React from "react"
import LoginForm from "@/components/forms/LoginForm.tsx"
import { useEffect } from "react"

const Login: React.FC = () => {
    useEffect(() => {
    document.title = "Log In";
  }, []);
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
  )
}

export default Login
