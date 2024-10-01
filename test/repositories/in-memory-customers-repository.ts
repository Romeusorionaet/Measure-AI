import { CustomerRepository } from "@/domain/vision-meter/application/repositories/customer-repository";
import { InMemoryMeasureDataRepository } from "./in-memory-measures-data-repository";
import { Customer } from "@/domain/vision-meter/enterprise/entities/customer";
import { MeasureType } from "@/domain/vision-meter/enterprise/entities/measure-type";
import { Measure } from "@/domain/vision-meter/enterprise/entities/measure";

export class InMemoryCustomersRepository implements CustomerRepository {
  public customers: Customer[] = [];

  constructor(public measureData: InMemoryMeasureDataRepository) {}

  async create(customer: Customer): Promise<void> {
    this.customers.push(customer);
  }

  async filterByCodeAndType(
    customerCode: string,
    measureType?: MeasureType,
  ): Promise<Measure[]> {
    const customer = await this.findByCode(customerCode);

    if (!customer) {
      return [];
    }

    const customerId = customer.id.toString();

    const measures = this.measureData.items.filter((measure) => {
      const belongsToCustomer = measure.customerId.toString() === customerId;

      const matchesMeasureType = measureType
        ? measure.measureType === measureType
        : true;

      return belongsToCustomer && matchesMeasureType;
    });

    return measures;
  }

  async findByCode(customerCode: string): Promise<Customer | null> {
    const customer = this.customers.find(
      (value) => value.customerCode === customerCode,
    );

    if (!customer) {
      return null;
    }

    return customer;
  }
}
