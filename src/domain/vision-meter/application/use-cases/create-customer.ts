import { Customer } from "../../enterprise/entities/customer";
import { CustomerRepository } from "../repositories/customer-repository";

interface CreateCustomerUseCaseRequest {
  customerCode: string;
}

export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    customerCode,
  }: CreateCustomerUseCaseRequest): Promise<Customer> {
    let customer = await this.customerRepository.findByCode(customerCode);

    if (!customer) {
      customer = Customer.create({
        customerCode,
      });

      await this.customerRepository.create(customer);
    }

    return customer;
  }
}
