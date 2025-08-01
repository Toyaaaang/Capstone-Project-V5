export const Menu = [
    {
      title: "Dashboard",
      items: [{ title: "Overview", url: "/pages/employee" }],
    },
    {
      title: "Material Requests",
      items: [
        { title: "Create Material Request", url: "/pages/employee/requests" },
        { title: "Track Requests", url: "/pages/employee/requests-history" },

      ],
    },
    {
      title: "Material Returns",
      items: [
        { title: "Salvage Return", url: "/pages/employee/salvage" },
        { title: "Credit Return", url: "/pages/employee/credit" },
        { title: "Return History", url: "/pages/employee/return-history" },
      ],
    },
    {
      title: "Accountability Management",
      items: [
        { title: "Materials", url: "/pages/employee/materials-accountability" },
      ],
    },
  ];