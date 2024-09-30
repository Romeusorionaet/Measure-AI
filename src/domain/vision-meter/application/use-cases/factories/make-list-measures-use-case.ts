import { ListMeasuresUseCase } from "../list-measures";
import { PrismaCustomerRepository } from "src/infra/database/prisma/repositories/prisma-customer-repository";

export function makeListMeasuresUseCase() {
  const customerRepository = new PrismaCustomerRepository();
  const useCase = new ListMeasuresUseCase(customerRepository);

  return useCase;
}
