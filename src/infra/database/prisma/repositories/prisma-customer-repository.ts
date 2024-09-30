import { CustomerRepository } from "src/domain/vision-meter/application/repositories/cusotmer-repository";
import { Customer } from "src/domain/vision-meter/enterprise/entities/customer";
import { prisma } from "src/infra/service/prisma";
import { PrismaCustomerMapper } from "../mappers/prisma-customer-mapper";

export class PrismaCustomerRepository implements CustomerRepository {
  async create(customerCode: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customerCode);

    await prisma.customer.create({
      data,
    });
  }
}
