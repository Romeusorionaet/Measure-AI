import { MeasureType } from "@/domain/vision-meter/enterprise/entities/measure-type";
import { z } from "zod";

export const querySchema = z.object({
  measure_type: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) => val in MeasureType)
    .transform((val) => val as MeasureType)
    .optional(),
});
