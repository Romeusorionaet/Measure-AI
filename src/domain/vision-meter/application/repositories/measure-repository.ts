import { Measure } from "../../enterprise/entities/measure";
import { MeasureType } from "../../enterprise/entities/measure-type";

export interface MeasureRepository {
  create(measure: Measure): Promise<{ measureId: string }>;
  findByTypeAndDateTime(
    measureType: MeasureType,
    measureDatetime: string,
  ): Promise<boolean>;
  findById(measureId: string): Promise<Measure | null>;
  update(measure: Measure): Promise<void>;
}
