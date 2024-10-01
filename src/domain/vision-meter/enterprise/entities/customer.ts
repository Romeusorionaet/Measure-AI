import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface CustomerProps {
  customerCode: string;
}

export class Customer extends Entity<CustomerProps> {
  get customerCode() {
    return this.props.customerCode;
  }

  static create(props: CustomerProps, id?: UniqueEntityID) {
    const customer = new Customer(
      {
        ...props,
      },
      id,
    );

    return customer;
  }
}
