import { config } from "dotenv";
import { z } from "@zod/mini";

let env_file = ".env.example";

switch (process.env?.NODE_ENV) {
  case "production":
    env_file = ".env.production";
    break;
  case "development":
    env_file = ".env.development";
    break;
  case "test":
    env_file = ".env.test";
    break;
  default:
    env_file = ".env.development";
}

config({
  path: env_file,
});

const SCHEMA_ENV = z.object({
  NODE_ENV: z._default(
    z.enum(["development", "production", "test"]),
    "development",
  ),
  PORT: z.coerce.number(),
  API_URL: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_TENANT: z.optional(z.string()),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_USER: z.string(),
});

type ENV_TYPE = z.infer<typeof SCHEMA_ENV>;

const parsed = SCHEMA_ENV.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid ENV vars:", JSON.stringify(parsed.error, null, 2));
  process.exit(1);
}

export const parsed_env: ENV_TYPE = parsed.data;
