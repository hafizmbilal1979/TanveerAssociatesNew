const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  console.log({
    projects: await p.project.count(),
    users: await p.user.count(),
    sections: await p.homeSection.count(),
    categories: await p.category.count(),
    team: await p.teamMember.count(),
    sliders: await p.slider.count(),
  });
  await p.$disconnect();
})().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
