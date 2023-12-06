"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("@/utils/prisma");
const hashPassword_1 = require("@/helpers/hashPassword");
const userData = [
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Start seeding ...`);
        for (const u of userData) {
            const userHashedPassword = yield (0, hashPassword_1.hashPassword)(u.password);
            const user = yield prisma_1.prismaClient.user.create({
                data: Object.assign(Object.assign({}, u), { password: userHashedPassword }),
            });
            console.log(`Created user with id: ${user.id}`);
        }
        console.log(`Seeding finished.`);
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prismaClient.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma_1.prismaClient.$disconnect();
    process.exit(1);
}));
