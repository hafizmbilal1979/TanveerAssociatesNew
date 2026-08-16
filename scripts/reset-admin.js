const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

(async () => {
  const prisma = new PrismaClient();
  await prisma.loginAttempt.deleteMany();
  const email = "admin@tanveerassociates.com";
  const password = "Admin@TAA2026!";
  const hash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash, isActive: true, role: "admin" },
    create: {
      name: "Site Administrator",
      email,
      passwordHash: hash,
      role: "admin",
      isActive: true,
    },
  });
  const user = await prisma.user.findUnique({ where: { email } });
  const ok = await bcrypt.compare(password, user.passwordHash);
  console.log("user", user.email, "passwordOk", ok);
  await prisma.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
