import { MeasureRepository } from "@/domain/vision-meter/application/repositories/measure-repository";
import { InMemoryMeasureDataRepository } from "./in-memory-measures-data-repository";
import { CustomerRepository } from "@/domain/vision-meter/application/repositories/customer-repository";
import { Measure } from "@/domain/vision-meter/enterprise/entities/measure";
import { MeasureType } from "@/domain/vision-meter/enterprise/entities/measure-type";

export class InMemoryMeasuresRepository implements MeasureRepository {
  constructor(
    public measureData: InMemoryMeasureDataRepository,
    public customerRepository: CustomerRepository,
  ) {}

  async create(measure: Measure): Promise<{ measureId: string }> {
    this.measureData.items.push(measure);

    return { measureId: measure.id.toString() };
  }

  async findByMatchParams(
    measureType: MeasureType,
    measureDatetime: string,
    customerCode: string,
  ): Promise<boolean> {
    const customer = await this.customerRepository.findByCode(customerCode);

    if (!customer) {
      return false;
    }

    const customerId = customer.id.toString();
    const dateObj = new Date(measureDatetime);

    const startOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const endOfMonth = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const result = this.measureData.items.find((measure) => {
      const matchesCustomerAndType =
        measure.measureType === measureType &&
        measure.customerId.toString() === customerId;

      const measureDate = new Date(measure.measureDatetime);

      const withinDateRange =
        measureDate >= startOfMonth && measureDate <= endOfMonth;

      return matchesCustomerAndType && withinDateRange;
    });

    return !!result;
  }

  async findById(measureId: string): Promise<Measure | null> {
    const measure = this.measureData.items.find(
      (value) => value.id.toString() === measureId,
    );

    if (!measure) {
      return null;
    }

    return measure;
  }

  async update(measure: Measure): Promise<void> {
    const existingMeasure = this.measureData.items.find(
      (value) => value.id === measure.id,
    );

    if (existingMeasure) {
      Object.assign(existingMeasure, measure);
    } else {
      throw new Error("Measure not found error");
    }
  }
}
