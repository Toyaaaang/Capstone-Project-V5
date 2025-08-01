// app/unauthorized/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted px-4 dark:bg-background">
      <div className="max-w-md text-center bg-white shadow-xl rounded-2xl p-8 border dark:bg-card dark:border-muted">
        <Image
          src="/unauthorized.gif"
          alt="Access Denied"
          width={200}
          height={200}
          className="mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-destructive dark:text-red-400">Access Denied</h1>
        <p className="mt-2 text-sm text-muted-foreground dark:text-muted">
          You don’t have permission to view this page.
        </p>
        <Button
          variant="default"
          className="mt-6 w-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2" />
          Go Back
        </Button>
        <Button
          variant="outline"
          className="mt-2 w-full"
          onClick={() => router.push("/login")}
        >
          <ArrowLeft className="mr-2" />
          Back to Login
        </Button>
      </div>
    </div>
  );
}
