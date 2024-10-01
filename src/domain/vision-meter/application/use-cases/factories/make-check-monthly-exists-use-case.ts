import { PrismaMeasureRepository } from "@/infra/database/prisma/repositories/prisma-measure-repository";
import { CheckMonthlyReadingExistsUseCase } from "../check-monthly-reading-exists";

export function makeCheckMonthlyReadingExistsUseCase() {
  const measureRepository = new PrismaMeasureRepository();
  const useCase = new CheckMonthlyReadingExistsUseCase(measureRepository);

  return useCase;
}
