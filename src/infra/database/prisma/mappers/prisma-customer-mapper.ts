import { Prisma, Customer as PrismaCustomer } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Customer } from "src/domain/vision-meter/enterprise/entities/customer";

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
