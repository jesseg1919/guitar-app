// NOTE: After cloning, run `npx prisma generate` to create the typed Prisma client.
// Until then, this module exports a loosely-typed placeholder so the project compiles.

/* eslint-disable @typescript-eslint/no-explicit-any */

let PrismaClientConstructor: any;
try {
  PrismaClientConstructor = require("@prisma/client").PrismaClient;
} catch {
  // Prisma client not yet generated — provide a stub for build time
  PrismaClientConstructor = class StubPrismaClient {
    constructor() {
      console.warn(
        "⚠️  Prisma client not generated. Run: npx prisma generate"
      );
    }
  };
}

const globalForPrisma = globalThis as unknown as { prisma: any };

export const prisma: any =
  globalForPrisma.prisma ??
  new PrismaClientConstructor({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
