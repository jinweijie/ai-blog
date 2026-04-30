import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function getArg(name: string) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

async function main() {
  const email = getArg("--email");
  const password = getArg("--password");
  const name = getArg("--name");

  if (!email || !password) {
    console.error("Usage: npm run create-admin -- --email you@example.com --password secret [--name Name]");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.error("User already exists.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      name: name || null,
      passwordHash,
      role: "admin",
    },
  });

  console.log("Admin user created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
