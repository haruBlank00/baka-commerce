import { PrismaClient } from "@prisma/client";

/**
 * we have to initialize prisma client only once, hence this setup
 * where we create a global cariabl with prisma instance once when our server starts
 * wont' instantiate on consucitive use
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient;
}

if (!global.__prisma) {
  global.__prisma = new PrismaClient();
}

global.__prisma.$connect();

export const prisma = global.__prisma;
