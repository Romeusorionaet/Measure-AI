import { CustomerRepository } from "@/domain/vision-meter/application/repositories/customer-repository";
import { PrismaCustomerMapper } from "../mappers/prisma-customer-mapper";
import { PrismaMeasureMapper } from "../mappers/prisma-measure-mapper";
import { Customer } from "@/domain/vision-meter/enterprise/entities/customer";
import { prisma } from "@/infra/service/prisma";
import { MeasureType } from "@/domain/vision-meter/enterprise/entities/measure-type";
import { Measure } from "@/domain/vision-meter/enterprise/entities/measure";

export class PrismaCustomerRepository implements CustomerRepository {
  async create(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer);

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
