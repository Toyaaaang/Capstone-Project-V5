"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useRegister from "@/hooks/auth/useRegister";
import zxcvbn from "zxcvbn";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { isLoading, register } = useRegister();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
    suboffice: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [idImage, setIdImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setIdImage(e.target.files[0]);
  };

  const passwordStrength = zxcvbn(formData.password);
  const passwordScore = passwordStrength.score;

  const uploadIdImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "user_id_upload");
    const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL as string, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.role === "employee" && !formData.department) {
      toast.error("Please select a department.");
      return;
    }
    if (formData.role === "sub_office" && !formData.suboffice) {
      toast.error("Please select a sub office.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (passwordScore < 2) {
      toast.error("Password is too weak. Try adding numbers, symbols, or more characters.");
      return;
    }

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      firstName: formData.firstName,
      lastName: formData.lastName,
      department: formData.department || undefined,
      suboffice: formData.suboffice || undefined,
    };

    try {
      let idImageUrl = "";
      if (idImage) {
        setUploadingImage(true); // Start uploading
        idImageUrl = await uploadIdImage(idImage);
        setUploadingImage(false); // Done uploading
      }

      // Register user
      await register({ ...payload, idImageUrl: idImageUrl });
      toast.success("Registration successful! Please wait for admin verification.");
      router.push("/login");
    } catch (error: any) {
      setUploadingImage(false); // Ensure it's reset on error
      const detail = error?.response?.data;
      if (typeof detail === "object") {
        const firstError = Object.values(detail)[0];
        toast.error(firstError as string);
      } else {
        toast.error("An error occurred during registration.");
      }
    }
  };

  // Helper for transitions
  const transitionClass =
    "transition-all duration-400 ease-in-out overflow-hidden";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div
        className="relative z-10 p-8 w-full max-w-md"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          boxShadow: "0 8px 32px 0 rgba(23, 23, 23, 0.37)",
          backdropFilter: "blur(4.5px)",
          WebkitBackdropFilter: "blur(3.5px)",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <Card className="bg-transparent shadow-none border-none">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">Register</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name..."
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="text-white placeholder-white bg-transparent border-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name..."
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="text-white placeholder-white bg-transparent border-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username..."
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="text-white placeholder-white bg-transparent border-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="text-white placeholder-white bg-transparent border-white"
                  />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
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
                      className="absolute inset-y-0 right-2 flex items-center text-white"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground md:col-span-2">
                  Strength: <span className={
                    passwordScore < 2 ? "text-red-600" :
                    passwordScore < 4 ? "text-yellow-600" : "text-green-600"
                  }>
                    { ["Very Weak", "Weak", "Fair", "Good", "Strong"][passwordScore] }
                  </span>
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password..."
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="text-white placeholder-white bg-transparent border-white pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute inset-y-0 right-2 flex items-center text-white"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        role: value,
                        // Reset department and suboffice when role changes
                        department: "",
                        suboffice: "",
                      }))
                    }
                    value={formData.role}
                    required
                  >
                    <SelectTrigger className="w-full text-white border-white bg-transparent">
                      <SelectValue placeholder="Role" className="text-white" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warehouse_staff">Warehouse Staff</SelectItem>
                      <SelectItem value="budget_analyst">Budget Analyst</SelectItem>
                      <SelectItem value="engineering">Engineering Dept. Head</SelectItem>
                      <SelectItem value="operations_maintenance">Operations & Maintenance Dept. Head</SelectItem>
                      <SelectItem value="warehouse_admin">Warehouse Admin</SelectItem>
                      <SelectItem value="manager">General Manager</SelectItem>
                      <SelectItem value="sub_office">Sub Office</SelectItem>
                      <SelectItem value="finance">Finance Dept.</SelectItem>
                      <SelectItem value="audit">Audit Dept.</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Department dropdown for employee only (not sub_office) */}
                <div
                  className={cn(
                    "md:col-span-2",
                    transitionClass,
                    formData.role === "employee"
                      ? "max-h-40 opacity-100 mt-0"
                      : "max-h-0 opacity-0 mt-[-1rem] pointer-events-none"
                  )}
                  aria-hidden={formData.role !== "employee"}
                >
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, department: value }))
                    }
                    value={formData.department}
                    required={formData.role === "employee"}
                    disabled={formData.role !== "employee"}
                  >
                    <SelectTrigger className="w-full text-white border-white bg-transparent">
                      <SelectValue placeholder="Select Department" className="text-white" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="operations_maintenance">Operations & Maintenance</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Sub office area dropdown for sub_office */}
                <div
                  className={cn(
                    "md:col-span-2",
                    transitionClass,
                    formData.role === "sub_office"
                      ? "max-h-40 opacity-100 mt-0"
                      : "max-h-0 opacity-0 mt-[-1rem] pointer-events-none"
                  )}
                  aria-hidden={formData.role !== "sub_office"}
                >
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, suboffice: value }))
                    }
                    value={formData.suboffice}
                    required={formData.role === "sub_office"}
                    disabled={formData.role !== "sub_office"}
                  >
                    <SelectTrigger className="w-full text-white border-white bg-transparent">
                      <SelectValue placeholder="Select Sub Office Area" className="text-white bg-transparent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sub_office_a">Sub Office A</SelectItem>
                      <SelectItem value="sub_office_b">Sub Office B</SelectItem>
                      <SelectItem value="sub_office_c">Sub Office C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* File input for photo ID */}
                <div className="md:col-span-2 grid gap-2">
                  <Label htmlFor="photoId" className="text-white">Photo ID</Label>
                  <Input
                    id="photoId"
                    name="photoId"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    required
                    className="text-white placeholder-white bg-transparent border-white"
                  />
                  <span className="text-xs text-white/80 -mt-2 mt-1">
                    Please take a picture of your ID for role verification.
                  </span>
                </div>
                {/* Buttons */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full px-6 py-2 rounded-xl bg-green-500 bg-opacity-80 text-white font-semibold transition-colors duration-300 border-2 border-transparent hover:bg-green-800 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-300"
                    disabled={isLoading}
                  >
                    {isLoading || uploadingImage ? "Registering..." : "Register"}
                  </button>
                  <button
                    type="button"
                    className="w-full px-6 py-2 rounded-xl border-2 border-white text-white font-semibold transition-colors duration-300 hover:bg-white hover:text-green-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
                    onClick={() => signIn("google")}
                  >
                    Continue with Google
                  </button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-white">
                Already have an account? <a href="/auth/login" className="underline underline-offset-4">Sign in</a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}