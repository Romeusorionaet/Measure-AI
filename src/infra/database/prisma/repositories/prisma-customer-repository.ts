import { CustomerRepository } from "src/domain/vision-meter/application/repositories/customer-repository";
import { Customer } from "src/domain/vision-meter/enterprise/entities/customer";
import { prisma } from "src/infra/service/prisma";
import { PrismaCustomerMapper } from "../mappers/prisma-customer-mapper";
import { PrismaMeasureMapper } from "../mappers/prisma-measure-mapper";
import { MeasureType } from "src/domain/vision-meter/enterprise/entities/measure-type";
import { Measure } from "src/domain/vision-meter/enterprise/entities/measure";

export class PrismaCustomerRepository implements CustomerRepository {
  async create(customerCode: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customerCode);

    await prisma.customer.create({
      data,
    });
  }

  async filterByCodeAndType(
    customerCode: string,
    measureType?: MeasureType,
  ): Promise<Measure[]> {
    const [customer] = await prisma.customer.findMany({
      where: {
        customerCode,
      },
      include: {
        measures: {
          where: measureType ? { measureType } : {},
        },
      },
    });

    if (!customer) {
      return [];
    }

    const measures = customer.measures.map(PrismaMeasureMapper.toDomain);

    return measures;
  }

  async findByCode(customerCode: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { customerCode },
    });

    if (!customer) {
      return null;
    }

    return PrismaCustomerMapper.toDomain(customer);
  }
}
