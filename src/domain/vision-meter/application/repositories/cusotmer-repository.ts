import { Customer } from "../../enterprise/entities/customer";
import { Measure } from "../../enterprise/entities/measure";
import { MeasureType } from "../../enterprise/entities/measure-type";

export interface CustomerRepository {
  create(customerCode: Customer): Promise<void>;
  filterByCodeAndType(
    customerCode: string,
    measureType?: MeasureType,
  ): Promise<Measure[]>;
}
