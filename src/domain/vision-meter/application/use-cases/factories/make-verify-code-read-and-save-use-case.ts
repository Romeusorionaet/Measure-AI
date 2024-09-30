import { PrismaMeasureRepository } from "src/infra/database/prisma/repositories/prisma-measure-repository";
import { VerifyCodeReadAndSaveUseCase } from "../verify-code-read-and-save";

export function makeVerifyCodeReadAndSaveUseCase() {
  const measureRepository = new PrismaMeasureRepository();
  const useCase = new VerifyCodeReadAndSaveUseCase(measureRepository);

  return useCase;
}
