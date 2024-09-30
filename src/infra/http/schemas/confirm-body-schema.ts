import { z } from "zod";

export const confirmBodySchema = z.object({
  measure_uuid: z.string(),
  confirmed_value: z.number(),
});
