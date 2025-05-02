import { config } from 'dotenv';
import { z } from '@zod/mini';

config({
  path: '.env',
});

const SCHEMA_ENV = z.object({
  NODE_ENV: z._default(z.enum(['development', 'production', 'test']), 'development'),
  PORT: z.coerce.number(),
  API_URL: z.string(),
  DATABASE_URL: z.string(),
});

type ENV_TYPE = z.infer<typeof SCHEMA_ENV>

const parsed = SCHEMA_ENV.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid ENV vars:', parsed.error);
  process.exit(1);
}

// 4) Export a fully-typed config object
export const parsed_env: ENV_TYPE = parsed.data;
