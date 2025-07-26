import { Skeleton } from "@/components/ui/skeleton";

export default function TableLoader() {
  return (
    <div className="p-10 border rounded-md shadow-sm m-4">
      <h2 className="text-xl font-bold mb-4">
        <Skeleton className="h-6 w-1/4" />
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {Array.from({ length: 5 }).map((_, index) => (
                <th key={index} className="p-2">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <td key={colIndex} className="p-2">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}