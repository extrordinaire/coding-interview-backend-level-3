import { defineConfig } from "drizzle-kit";

import { parsed_env } from "@/parsed_env";

export const db_credentials = {
  host: parsed_env.DATABASE_HOST,
  port: parsed_env.DATABASE_PORT,
  database: parsed_env.DATABASE,
  user: `${parsed_env.DATABASE_USER}${parsed_env?.DATABASE_TENANT ? "." + parsed_env.DATABASE_TENANT : ""}`,
  password: parsed_env.DATABASE_PASSWORD,
};

const drizzle_config = defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: db_credentials,
});

export default drizzle_config;
