import { PrismaCustomerRepository } from "@/infra/database/prisma/repositories/prisma-customer-repository";
import { ListMeasuresUseCase } from "../list-measures";

export function makeListMeasuresUseCase() {
  const customerRepository = new PrismaCustomerRepository();
  const useCase = new ListMeasuresUseCase(customerRepository);

  return useCase;
}
