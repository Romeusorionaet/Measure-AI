import { CreateMeasureUseCase } from "../create-measure";
import { CreateCustomerUseCase } from "../create-customer";
import { PrismaMeasureRepository } from "@/infra/database/prisma/repositories/prisma-measure-repository";
import { PrismaCustomerRepository } from "@/infra/database/prisma/repositories/prisma-customer-repository";

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
