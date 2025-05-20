import { drizzle as drizzle_postgres } from "drizzle-orm/postgres-js";
import { db_credentials } from "~/drizzle.config";

let db: ReturnType<typeof drizzle_postgres>;

export function create_db() {
  if (db) {
    return db;
  }

  db = drizzle_postgres(
    `postgresql://${db_credentials.user}:${db_credentials.password}@${db_credentials.host}:${db_credentials.port}/${db_credentials.database}`,
  );

  return db;
}
