import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  DATABASE_URL: z.string().url(),
  GEMINI_API_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  WAIT_HOSTS: z.string(),
});
