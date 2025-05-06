import { drizzle } from "drizzle-orm/postgres-js";
import { db_credentials } from '~/drizzle.config'

export const db = drizzle(
  `postgresql://${db_credentials.user}:${db_credentials.password}@${db_credentials.host}:${db_credentials.port}/${db_credentials.database}`
);

