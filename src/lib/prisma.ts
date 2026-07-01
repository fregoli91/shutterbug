import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function hasDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  return Boolean(url && !url.includes('USER:PASSWORD') && !url.includes('localhost:5432/shutterbug'));
}

export function getPrisma() {
  if (!hasDatabaseUrl()) return null;
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}

export function requirePrisma() {
  const prisma = getPrisma();
  if (!prisma) {
    throw new Error('DATABASE_URL is not configured. Connect Postgres before using admin or checkout operations.');
  }
  return prisma;
}
