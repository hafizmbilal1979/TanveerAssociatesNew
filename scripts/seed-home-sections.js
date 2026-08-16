const { PrismaClient } = require("@prisma/client");

(async () => {
  const prisma = new PrismaClient();
  const count = await prisma.homeSection.count();
  if (count === 0) {
    await prisma.homeSection.createMany({
      data: [
        {
          key: "practice",
          type: "practice",
          eyebrow: "Practice",
          title: "A studio measured in decades, not seasons.",
          body: "The firm was established in 1992 under the name of Tanveer & Cezzane Associates. In 2002, its name was changed to Tanveer Ahmed Associates and has operated as a registered firm.",
          ctaLabel: "About the firm",
          ctaUrl: "/about",
          bgStyle: "paper",
          sortOrder: 1,
          isEnabled: true,
        },
        {
          key: "featured",
          type: "featured",
          eyebrow: "Selected work",
          title: "Featured projects",
          body: "",
          ctaLabel: "All projects",
          ctaUrl: "/projects",
          bgStyle: "stone",
          sortOrder: 2,
          isEnabled: true,
        },
        {
          key: "services",
          type: "services",
          eyebrow: "Services",
          title: "Disciplines across the built environment.",
          body: "",
          ctaLabel: null,
          ctaUrl: null,
          bgStyle: "paper",
          sortOrder: 3,
          isEnabled: true,
        },
      ],
    });
    console.log("Home sections seeded");
  } else {
    console.log("Home sections already exist:", count);
  }

  await prisma.user.updateMany({
    where: { email: "admin@tanveerassociates.com" },
    data: { role: "admin", isActive: true },
  });
  console.log("Admin role ensured");
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
