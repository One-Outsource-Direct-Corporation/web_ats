import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import type { AxiosResponse } from "axios";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response: AxiosResponse = await login({ email, password });
      if (response.status === 200) {
        toast.success("Login successful!");
      }
    } catch (err: any | AxiosError) {
      // Error is handled by the auth context
      toast.error(
        err.response?.data?.detail ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <h1 className="text-5xl md:text-6xl font-bold text-center text-gray-800 mb-6 font-oswald">
        Welcome!
      </h1>

      {/* {error && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )} */}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-lg">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            className="pl-10 pr-4 text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-lg">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            className="pl-10 pr-12 text-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-600"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="mb-6 flex items-center space-x-3">
        <Checkbox
          id="keep-logged-in"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          disabled={isLoading}
        />
        <label htmlFor="keep-logged-in" className="text-lg">
          Keep me logged in
        </label>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full text-lg py-6 bg-[#0056d2]"
        disabled={isLoading}
      >
        {isLoading ? "LOGGING IN..." : "LOG IN"}
      </Button>
    </form>
  );
};

export default LoginForm;
