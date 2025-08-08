import { useState, useEffect } from "react";
import { Input } from "./input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./select";

type Option = { label: string; value: string };

interface SearchAndFilterProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  dropdowns?: Array<{
    label: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
  }>;
  debounceMs?: number;
  className?: string;
}

export function SearchAndFilter({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  dropdowns = [],
  debounceMs = 400,
  className = "",
}: SearchAndFilterProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchValue) onSearchChange(localSearch);
    }, debounceMs);
    return () => clearTimeout(handler);
    // eslint-disable-next-line
  }, [localSearch]);

  return (
    <div className={`flex flex-nowrap gap-2 items-center ${className}`}>
      <Input
        placeholder={searchPlaceholder}
        value={localSearch}
        onChange={e => setLocalSearch(e.target.value)}
        className="max-w-xs"
      />
      {dropdowns.map((dropdown, idx) => (
        <Select key={idx} value={dropdown.value} onValueChange={dropdown.onChange}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder={dropdown.label}  />
          </SelectTrigger>
          <SelectContent>
            {dropdown.options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}