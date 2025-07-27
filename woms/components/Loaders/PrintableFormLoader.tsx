import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PrintableFormLoader() {
  return (
    <div className="bg-white/40 dark:bg-zinc-900/60 backdrop-blur-[4.5px] p-8 max-w-3xl mx-auto print:w-full print:p-0 transition-colors">
      <Card className="p-6 bg-white/80 dark:bg-zinc-900/80 transition-colors">
        {/* Header */}
        <div className="flex ml-28 items-center gap-4 mb-2">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-6 w-56 mx-auto mb-4" />
        <Skeleton className="h-4 w-80 mx-auto mb-6" />

        {/* Info Grid */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Table */}
        <div className="mt-4">
          <Skeleton className="h-8 w-full mb-2" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full mb-1" />
          ))}
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-8 mt-10">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-12 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}