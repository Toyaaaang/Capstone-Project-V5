import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in ${className}`}
      style={{ animation: "fadeIn 0.7s" }}
    >
      <div className="relative mb-6">
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500 drop-shadow-lg" />
        </span>
        <span className="block h-16 w-16 rounded-full bg-blue-200 opacity-30 blur-xl"></span>
      </div>
      <h2 className="text-2xl font-bold text-blue-700 mb-2 animate-pulse">Loading...</h2>
      <p className="text-blue-500 text-lg animate-fade-in-slow">Please wait while we prepare your experience.</p>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.7s;
        }
        .animate-fade-in-slow {
          animation: fadeIn 1.5s;
        }
      `}</style>
    </div>
  );
}
