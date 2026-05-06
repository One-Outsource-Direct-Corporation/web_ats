import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerCandidate } from "@/features/auth/api/authApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";

export default function CandidateRegister() {
  const navigate = useNavigate();
  const { setUser, setIsAuth } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!form.first_name.trim()) return "First name is required.";
    if (!form.last_name.trim()) return "Last name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await registerCandidate(form);
      // Backend returns user data on successful registration
      if (response.data?.user) {
        setUser(response.data.user);
        setIsAuth(true);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate("/candidate/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
          <p className="text-gray-600">Redirecting you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Main */}
      <div className="flex flex-col md:flex-row flex-grow min-h-0 bg-gray-50">
        {/* Branding Side */}
        <div className="w-full md:w-[45%] bg-white p-6 flex flex-col justify-center items-center flex-shrink-0">
          <img
            src="/OODC%20logo2.png"
            alt="OODC Logo"
            className="w-60 sm:w-72 md:w-96 lg:w-[30rem] xl:w-[36rem] mb-6"
          />
          <p className="text-gray-600 text-center max-w-sm mt-4">
            Create your candidate account to apply for positions and track your applications.
          </p>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-[55%] bg-gray-100 flex items-center justify-center px-6 sm:px-8 py-10">
          <div className="w-full max-w-xl">
            <div className="mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 -ml-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-2 font-oswald">
              Create Account
            </h1>
            <p className="text-center text-gray-500 mb-8">
              Join us to start your career journey
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-base">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="John"
                      required
                      value={form.first_name}
                      onChange={handleChange}
                      className="pl-10 text-base h-12"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-base">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Doe"
                      required
                      value={form.last_name}
                      onChange={handleChange}
                      className="pl-10 text-base h-12"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="pl-10 text-base h-12"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={handleChange}
                    className="pl-10 pr-12 text-base h-12"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Must be at least 8 characters long.</p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg py-6 bg-[#0056d2]"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white text-center py-3 text-sm text-gray-700 shadow-md">
        © 2024 Outsource Direct Corporation |{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
      </footer>
    </div>
  );
}
