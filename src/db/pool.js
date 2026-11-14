import pg from 'pg'

const { Pool } = pg

// Supabase exige SSL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
