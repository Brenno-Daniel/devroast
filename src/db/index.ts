import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  db: Database | undefined;
  sql: ReturnType<typeof postgres> | undefined;
};

function getConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return url;
}

function getSql() {
  if (!globalForDb.sql) {
    globalForDb.sql = postgres(getConnectionString(), { max: 1 });
  }
  return globalForDb.sql;
}

/** Drizzle client with snake_case column mapping; use only on the server. */
export function getDb(): Database {
  if (!globalForDb.db) {
    globalForDb.db = drizzle(getSql(), { schema, casing: "snake_case" });
  }
  return globalForDb.db;
}
