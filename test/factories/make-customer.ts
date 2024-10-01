import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import {
  Customer,
  CustomerProps,
} from "src/domain/vision-meter/enterprise/entities/customer";

export function makeCustomer(
  override: Partial<CustomerProps> = {},
  id?: UniqueEntityID,
) {
  const customer = Customer.create(
    {
      customerCode: "123456",
      ...override,
    },
    id,
  );

  return customer;
}
