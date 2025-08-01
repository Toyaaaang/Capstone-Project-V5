export const Menu = [
    {
      title: "Dashboard",
      items: [{ title: "Overview", url: "/pages/sub-offices" }],
    },
    {
      title: "Material Requests",
      items: [
        { title: "Create Request", url: "/pages/sub-offices/requests" },
        { title: "Track Requests", url: "/pages/sub-offices/requests-history" },

      ],
    },
    {
      title: "Material Returns",
      items: [
        { title: "Salvage Return", url: "/pages/sub-offices/salvage" },
        { title: "Credit Return", url: "/pages/sub-offices/credit" },
        { title: "Return History", url: "/pages/sub-offices/return-history" },
      ],
    },
    {
      title: "Accountability Management",
      items: [
        { title: "Materials", url: "/pages/sub-offices/materials-accountability" },
      ],
    },
  ];