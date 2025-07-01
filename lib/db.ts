import { neon } from "@neondatabase/serverless"

const DATABASE_URL =
  process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || ""

export const sql = neon(DATABASE_URL)
