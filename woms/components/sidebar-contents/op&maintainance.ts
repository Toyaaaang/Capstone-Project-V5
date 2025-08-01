export const Menu = [
  {
    title: "Dashboard",
    items: [{ title: "Overview", url: "/pages/operations-maintenance" }],
  },
  {
    title: "Work Order Management",
    items: [
      { title: "Work Order Assignment", url: "/pages/operations-maintenance/material-requests" },
      { title: "Requests History", url: "/pages/operations-maintenance/evaluation-history" },
    ],
  },
  {
    title: "Material Quality Management",
    items: [
      { title: "Quality Compliance", url: "/pages/operations-maintenance/quality-check" },
      { title: "Quality Compliance History", url: "/pages/operations-maintenance/quality-history" },
    ],
  },
  {
    title: "Certification Management",
    items: [
      { title: "Certifications", url: "/pages/operations-maintenance/certificates" },
    ],
  },

  {
    title: "Restocking Management",
    items: [
      { title: "Requisition Voucher", url: "/pages/operations-maintenance/restocking-requests" },
      { title: "Restocking History", url: "/pages/operations-maintenance/requests-history" },
    ],
  },
  {
    title: "Accountability Management",
    items: [
      { title: "Accountabilities", url: "/pages/operations-maintenance/accountability" },
    ],
  },
];