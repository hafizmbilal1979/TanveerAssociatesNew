import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const maxAttempts = 40;
const delayMs = 15000;

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  try {
    const projects = await prisma.project.count();
    console.log(`OK attempt ${attempt}: ${projects} projects`);
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.log(
      `Waiting attempt ${attempt}/${maxAttempts}: ${error.message.split("\n")[0]}`,
    );
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

await prisma.$disconnect();
console.error("Database did not become ready in time.");
process.exit(1);
