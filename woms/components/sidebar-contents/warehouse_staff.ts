export const warehouseStaffMenu = [
    {
      title: "Dashboard",
      items: [{ title: "Overview", url: "/pages/warehouse_staff" }],
    },
    {
      title: "Requests Management",
      items: [
        { title: "Pending Requests", url: "/pages/warehouse_staff/material-requests" },
        { title: "Requests History", url: "/pages/warehouse_staff/evaluation-history" },

      ],
    },
    {
      title: "Material Charge",
      items: [
        { title: "Requests", url: "/pages/warehouse_staff/charge-requests" },
        { title: "Requests History", url: "/pages/warehouse_staff/charge-history" },
      ],
    },
    {
      title: "Delivery",
      items: [
        { title: "Delivery Checking", url: "/pages/warehouse_staff/check-delivery" },
        { title: "Delivery History", url: "/pages/warehouse_staff/delivery-history" },
      ],
    },

    {
      title: "Material Returns",
      items: [
        { title: "Credit Tickets", url: "/pages/warehouse_staff/credit-requests" },
        { title: "Salvage Tickets", url: "/pages/warehouse_staff/salvage-requests" },
        { title: "Returns History", url: "/pages/warehouse_staff/returns-history" },
      ],
    },
    {
      title: "Accountability Management",
      items: [
        { title: "Accountabilities", url: "/pages/warehouse_staff/accountability-management" },
      ],
    },
    {
      title: "Inventory Management",
      items: [
        { title: "Stocks Management", url: "/pages/warehouse_staff/stock" },
      ],
    },
    {
      title: "Reports",
      items: [
        { title: "Receiving Report", url: "/pages/warehouse_staff/receiving-report" },
        { title: "Report History", url: "/pages/warehouse_staff/reports" },
        { title: "Operations Report", url: "/pages/warehouse_staff/check-delivery" },

      ],
    },
  ];