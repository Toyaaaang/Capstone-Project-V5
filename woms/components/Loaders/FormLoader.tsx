import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FormLoader() {
  return (
    <Card className="p-6 w-full mx-auto space-y-4" style={{
              // border: "1px solid transparent",
              background: "rgba(0, 17, 252, 0.04)",
              boxShadow: "0 8px 38px 0 rgba(23,23,23,0.17)",
              backdropFilter: "blur(18.5px)",
              WebkitBackdropFilter: "blur(4.5px)",  
            }}>
      <Skeleton className="h-8 w-1/3 mb-4" /> {/* Title */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </Card>
  );
}
