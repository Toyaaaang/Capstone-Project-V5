import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

type Props = {
  values: any;
  onChange: (field: string, value: any) => void;
  userInfo: { role?: string };
};

// Purposes specific for finance/office supplies
const FINANCE_PURPOSE_OPTIONS = [
  { value: "Office Supplies", label: "Office Supplies – Stationery, paper, pens, etc." },
  { value: "Cleaning Materials", label: "Cleaning Materials – Disinfectants, mops, etc." },
  { value: "Computer/IT Supplies", label: "Computer/IT Supplies – Toner, mouse, keyboard, etc." },
  { value: "Furniture/Fixtures", label: "Furniture/Fixtures – Chairs, tables, cabinets" },
  { value: "Other Office Needs", label: "Other Office Needs – Miscellaneous" },
];

export default function FinanceFields({ values, onChange, userInfo }: Props) {
  const [requesterDepartment, setRequesterDepartment] = useState("");

  return (
    <div className="space-y-4">
      {/* Requester's Department */}
      {userInfo?.role !== "sub_office" && (
        <div>
          <Label className="p-2">Requester Department</Label>
          <Input
            value={requesterDepartment}
            onChange={(e) => setRequesterDepartment(e.target.value)}
            placeholder="Enter requester department"
            className="w-80"
          />
        </div>
      )}

      {/* Purpose */}
      <div>
        <Label className="p-2">Purpose</Label>
        <Select
          value={values.purpose}
          onValueChange={(value) => onChange("purpose", value)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select purpose..." />
          </SelectTrigger>
          <SelectContent>
            {FINANCE_PURPOSE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
