import { MeasureType } from "@/domain/vision-meter/enterprise/entities/measure-type";
import { z } from "zod";

export const uploadBodySchema = z.object({
  image: z.string(),
  customer_code: z.string(),
  measure_datetime: z.string(),
  measure_type: z.nativeEnum(MeasureType),
});
