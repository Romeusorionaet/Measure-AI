import { Customer } from "../../enterprise/entities/customer";

export interface CustomerRepository {
  create(customerCode: Customer): Promise<void>;
}
