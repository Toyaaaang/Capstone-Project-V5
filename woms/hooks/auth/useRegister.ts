"use client";

import { useState } from "react";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  department?: string;
  suboffice?: string;
  idImageUrl?: string;
}

export default function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Registration failed.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, success, register };
}
