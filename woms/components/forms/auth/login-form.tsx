"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import useLogin from "@/hooks/auth/useLogin";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { isLoading, login } = useLogin();

  const [formData, setFormData] = useState({
    identifier: "", // Can be username or email
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData); // { identifier, password }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div
        className="relative z-10 p-8 w-full max-w-md"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          boxShadow: "0 8px 32px 0 rgba(23, 23, 23, 0.37)",
          backdropFilter: "blur(3.5px)",
          WebkitBackdropFilter: "blur(3.5px)",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <Card className="bg-transparent shadow-none border-none">
          <CardHeader>
            <CardTitle className="text-2xl text-center mb-5 text-white">
              Login
            </CardTitle>
            <CardDescription className="text-white/80">
              Enter your username or email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {/* Identifier Field */}
                <div className="grid gap-2">
                  <Label htmlFor="identifier" className="text-white">
                    Username or Email
                  </Label>
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    placeholder="Enter your username or email..."
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                    className="text-white placeholder-white bg-transparent border-white"
                  />
                </div>

                {/* Password Field */}
                <div className="grid gap-2 relative">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <a
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-white/80"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password..."
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="text-white placeholder-white bg-transparent border-white pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-2 rounded-xl bg-green-500 bg-opacity-80 text-white font-semibold transition-colors duration-300 border-2 border-transparent
                    hover:bg-green-800 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>

                {/* Alt Login (e.g. Google) */}
                <button
                  type="button"
                  className="w-full px-6 py-2 rounded-xl border-2 border-white text-white font-semibold transition-colors duration-300
                    hover:bg-white hover:text-green-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Login with Google
                </button>
              </div>

              {/* Sign up link */}
              <div className="mt-4 text-center text-sm text-white">
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
