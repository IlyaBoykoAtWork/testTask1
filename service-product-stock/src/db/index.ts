import { PrismaClient } from "@prisma/client"
export { $Enums, Prisma } from "@prisma/client"

export const db = new PrismaClient()
