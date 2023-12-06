import { Prisma } from "@prisma/client";
import { prismaClient } from "@/utils/prisma";
import { hashPassword } from "@/helpers/hashPassword";

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    lastName: "Doe",
    email: "alice@prisma.io",
    password: "alicePassword",
    profile: {
      create: { bio: "I like turtles" },
    },
    exercises: {
      create: [
        {
          title: "Bench press",
          published: true,
        },
      ],
    },
  },
  {
    name: "Nilu",
    lastName: "Doe",
    email: "nilu@prisma.io",
    password: "niluPassword",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const userHashedPassword = await hashPassword(u.password);

    const user = await prismaClient.user.create({
      data: {
        ...u,
        password: userHashedPassword,
      },
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
