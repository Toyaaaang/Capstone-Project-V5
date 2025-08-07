import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  values: any;
  onChange: (field: string, value: any) => void;
};
const PURPOSE_OPTIONS = [
  { value: "Maintenance", label: "Maintenance – Preventive maintenance, upkeep" },
  { value: "Power Restoration", label: "Power Restoration – After typhoons or outages" },
  { value: "System Expansion", label: "System Expansion – Line extension, sitios" },
  { value: "Equipment Replacement", label: "Equipment Replacement – Damaged, outdated items" },
  { value: "Emergency Response", label: "Emergency Response – Urgent repair" },
  { value: "Buffer Stock", label: "Buffer Stock – Standby reserve" },
  { value: "Metering Projects", label: "Metering/Clustering – Feeder meters, clustering" },
  { value: "New Service Connections", label: "New Service – Consumer installations" },
  { value: "Office Needs", label: "Office/Sub-office – Electrical branch needs" },
  { value: "Special Projects", label: "Special Projects – BAPA, NEA, subsidies" },
];

export default function EngOpFields({ values, onChange }: Props) {
  return (
    <div className="space-y-4">
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
            {PURPOSE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Target Date and Manpower side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col w-full">
          <Label className="p-2">Target Date of Completion</Label>
          <Input
            type="date"
            value={values.target_completion}
            onChange={(e) => onChange("target_completion", e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col w-full">
          <Label className="p-2">Manpower Requirement</Label>
          <Input
            placeholder="e.g. 3"
            value={values.manpower}
            onChange={(e) => onChange("manpower", e.target.value)}
            min={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
