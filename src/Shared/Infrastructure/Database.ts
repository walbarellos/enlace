// ============================================================================
// PLATAFORMA ENLACE — SHARED INFRASTRUCTURE
// Arquivo: src/Shared/Infrastructure/Database.ts
// ============================================================================

import pkg from 'pg';
const { Pool } = pkg;

export const dbPool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  user: process.env.POSTGRES_USER || 'enlace_admin',
  password: process.env.POSTGRES_PASSWORD || 'enlace_admin_password_dev',
  database: process.env.POSTGRES_DB || 'enlace_db',
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000
});
