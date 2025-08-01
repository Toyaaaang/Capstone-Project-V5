export const Menu = [
    {
      title: "Dashboard",
      items: [{ title: "Overview", url: "/pages/budget" }],
    },
    {
      title: "Requisition Vouchers",
      items: [
        { title: "Requisition Requests", url: "/pages/budget/restocking-requests" },
        { title: "Requisition Requests History", url: "/pages/budget/requests-history" },
      ],
    },
    {
      title: "Purchase Management",
      items: [
        { title: "Purchase Orders", url: "/pages/budget/create-po" },
        { title: "Purchase Returns", url: "/pages/budget/create-purchase-return" },
        { title: "PO History", url: "/pages/budget/purchase-history" },
      ],
    },
  ];