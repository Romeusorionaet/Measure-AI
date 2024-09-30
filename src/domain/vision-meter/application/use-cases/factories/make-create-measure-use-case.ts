import { PrismaMeasureRepository } from "src/infra/database/prisma/repositories/prisma-measure-repository";
import { CreateMeasureUseCase } from "../create-measure";
import { PrismaCustomerRepository } from "src/infra/database/prisma/repositories/prisma-customer-repository";
import { CreateCustomerUseCase } from "../create-customer";

export function makeCreateMeasureUseCase() {
  const measureRepository = new PrismaMeasureRepository();
  const customerRepository = new PrismaCustomerRepository();
  const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

  const useCase = new CreateMeasureUseCase(
    measureRepository,
    createCustomerUseCase,
  );

  return useCase;
}
