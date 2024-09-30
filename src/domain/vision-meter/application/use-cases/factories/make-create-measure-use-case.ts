import { PrismaMeasureRepository } from "src/infra/database/prisma/repositories/prisma-measure-repository";
import { CreateMeasureUseCase } from "../create-measure";
import { PrismaCustomerRepository } from "src/infra/database/prisma/repositories/prisma-customer-repository";

export function makeCreateMeasureUseCase() {
  const measureRepository = new PrismaMeasureRepository();
  const customerRepository = new PrismaCustomerRepository();
  const useCase = new CreateMeasureUseCase(
    measureRepository,
    customerRepository,
  );

  return useCase;
}
