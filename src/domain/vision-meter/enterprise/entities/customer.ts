import { Optional } from "src/core/@types/optional";
import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface CustomerProps {
  customerCode: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export class Customer extends Entity<CustomerProps> {
  get customerCode() {
    return this.props.customerCode;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<CustomerProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const customer = new Customer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return customer;
  }
}
