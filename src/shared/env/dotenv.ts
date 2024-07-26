import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_USER: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_PORT: z.coerce.number(),
  PG_ADMIN_USER: z.coerce.string(),
  PG_ADMIN_PASSWORD: z.coerce.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.format());

  throw new Error('Invalid environment variables');
}

export const env = _env.data;
