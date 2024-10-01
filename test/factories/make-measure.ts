import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Measure,
  MeasureProps,
} from "@/domain/vision-meter/enterprise/entities/measure";
import { MeasureType } from "@/domain/vision-meter/enterprise/entities/measure-type";

export function makeMeasure(
  override: Partial<MeasureProps> = {},
  id?: UniqueEntityID,
) {
  const measure = Measure.create(
    {
      customerId: new UniqueEntityID(),
      measureDatetime: "2024-12-12T14:36:00Z",
      measureType: MeasureType.WATER,
      measureValue: 123456789,
      hasConfirmed: false,
      imageUrl: "https://img-test.com",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  );

  return measure;
}
