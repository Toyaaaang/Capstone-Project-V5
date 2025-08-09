export const Menu = [
    {
      title: "Dashboard",
      items: [{ title: "Overview", url: "/employee" }],
    },
    {
      title: "Material Requests",
      items: [
        { title: "Create Material Request", url: "/employee/requests" },
        { title: "Track Requests", url: "/employee/requests-history" },
      ],
    },
    {
      title: "Material Returns",
      items: [
        { title: "Salvage Return", url: "/employee/salvage" },
        { title: "Credit Return", url: "/employee/credit" },
        { title: "Return History", url: "/employee/return-history" },
      ],
    },
    {
      title: "Accountability Management",
      items: [
        { title: "Materials", url: "/employee/materials-accountability" },
      ],
    },
  ];