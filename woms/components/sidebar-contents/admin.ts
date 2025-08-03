export const warehouseAdminMenu = [
  {
    title: "Dashboard",
    items: [{ title: "Overview", url: "/admin" }],
  },
  {
    title: "Role Management",
    items: [
      { title: "Role Requests", url: "/admin/role-requests" },
      { title: "Approval History", url: "/admin/role-history" },
    ],
  },
  {
    title: "Approval Management",
    items: [
      { title: "Charge Tickets", url: "/admin/charge-tickets" },
      { title: "Material Certifications", url: "/admin/certifications" },
      { title: "Receiving Reports", url: "/admin/receiving-reports" },
      { title: "Salvage Tickets", url: "/admin/salvage-tickets" },
      { title: "Credit Tickets", url: "/admin/credit-tickets" },
    ],
  },
  {
    title: "Accountability Management",
    items: [
      { title: "Accountabilities", url: "/admin/accountability-management" },
      { title: "Audit Logs", url: "/admin/audit-logs" },
    ],
  },
  {
    title: "Inventory",
    items: [
      { title: "Stock Management", url: "/admin/stock" },
      { title: "Inventory Management", url: "/admin/inventory" },
      { title: "Materials Management", url: "/admin/materials" },
    ],
  },
];