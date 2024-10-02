import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  DATABASE_URL: z.string().url(),
  GEMINI_API_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
});
