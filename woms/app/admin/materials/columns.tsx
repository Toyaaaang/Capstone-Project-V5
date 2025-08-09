import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { SquarePen } from 'lucide-react';
import { ConfirmActionDialog } from "@/components/alert-dialog/AlertDialog";
import { Checkbox } from "@/components/ui/checkbox";

export const CATEGORY_OPTIONS = [
	{ value: "wiring", label: "Wiring and Conductors" },
	{ value: "poles", label: "Poles and Supports" },
	{ value: "metering", label: "Metering Equipment" },
	{ value: "transformers", label: "Transformers and Substations Equipment" },
	{ value: "hardware", label: "Hardware and Fasteners" },
	{ value: "safety", label: "Safety Equipment" },
	{ value: "tools", label: "Tools and Accessories" },
	{ value: "office_supply", label: "Office Supplies" },
	{ value: "uncategorized", label: "Uncategorized" },
];

export function getMaterialColumns({ onEdit, editingId, onChange, onSave, onCancel }: any): ColumnDef<any>[] {
	return [
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) =>
				editingId === row.original.id ? (
					<Input
						value={row.original.name}
						onChange={e => onChange(row.original.id, "name", e.target.value)}
					/>
				) : (
					row.original.name
				),
		},
		{
			accessorKey: "unit",
			header: "Unit",
			cell: ({ row }) =>
				editingId === row.original.id ? (
					<Input
						value={row.original.unit}
						onChange={e => onChange(row.original.id, "unit", e.target.value)}
					/>
				) : (
					row.original.unit
				),
		},
		{
			accessorKey: "category",
			header: "Category",
			cell: ({ row }) =>
				editingId === row.original.id ? (
					<Select
						value={row.original.category}
						onValueChange={val => onChange(row.original.id, "category", val)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{CATEGORY_OPTIONS.map(opt => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : (
					CATEGORY_OPTIONS.find(opt => opt.value === row.original.category)?.label || row.original.category
				),
		},
		{
			accessorKey: "visible",
			header: "Visible",
			cell: ({ row }) =>
				editingId === row.original.id ? (
					<Checkbox
						checked={row.original.visible}
						onCheckedChange={val => onChange(row.original.id, "visible", val === true)}
						aria-label="Visible"
					/>
				) : row.original.visible ? "Yes" : "No",
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) =>
				editingId === row.original.id ? (
					<>
						<ConfirmActionDialog
							trigger={
								<Button size="sm">
									Save
								</Button>
							}
							title="Save Changes"
							description="Are you sure you want to save these changes to the material?"
							confirmLabel="Save"
							cancelLabel="Cancel"
							onConfirm={() => onSave(row.original.id)}
						/>
						<Button size="sm" variant="outline" onClick={onCancel} className="ml-2">
							Cancel
						</Button>
					</>
				) : (
					<Button className="p-3" size="sm" onClick={() => onEdit(row.original.id)}>
						<SquarePen /> Edit
					</Button>
				),
		},
	];
}