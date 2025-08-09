export const warehouseStaffMenu = [
    {
      title: "Dashboard",
      items: [{ title: "Overview", url: "/staff" }],
    },
    {
      title: "Requests Management",
      items: [
        { title: "Pending Requests", url: "/staff/material-requests" },
        { title: "Requests History", url: "/staff/evaluation-history" },
      ],
    },
    {
      title: "Material Charge",
      items: [
        { title: "Requests", url: "/staff/charge-requests" },
        { title: "Requests History", url: "/staff/charge-history" },
      ],
    },
    {
      title: "Delivery",
      items: [
        { title: "Delivery Checking", url: "/staff/check-delivery" },
        { title: "Delivery History", url: "/staff/delivery-history" },
      ],
    },

    {
      title: "Material Returns",
      items: [
        { title: "Credit Tickets", url: "/staff/credit-requests" },
        { title: "Salvage Tickets", url: "/staff/salvage-requests" },
        { title: "Returns History", url: "/staff/returns-history" },
      ],
    },
    {
      title: "Accountability Management",
      items: [
        { title: "Accountabilities", url: "/staff/accountability-management" },
      ],
    },
    {
      title: "Inventory Management",
      items: [
        { title: "Stocks Management", url: "/staff/stock" },
      ],
    },
    {
      title: "Reports",
      items: [
        { title: "Receiving Report", url: "/staff/receiving-report" },
        { title: "Report History", url: "/staff/reports" },
        { title: "Operations Report", url: "/staff/check-delivery" },
      ],
    },
  ];