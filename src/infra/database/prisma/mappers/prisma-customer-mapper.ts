import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Customer } from "@/domain/vision-meter/enterprise/entities/customer";
import { Prisma, Customer as PrismaCustomer } from "@prisma/client";

export class PrismaCustomerMapper {
  static toDomain(raw: PrismaCustomer): Customer {
    return Customer.create(
      {
        customerCode: raw.customerCode,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(customer: Customer): Prisma.CustomerUncheckedCreateInput {
    return {
      id: customer.id.toString(),
      customerCode: customer.customerCode,
    };
  }
}
