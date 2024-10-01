import { Measure } from "src/domain/vision-meter/enterprise/entities/measure";

export class InMemoryMeasureDataRepository {
  public items: Measure[] = [];
}
