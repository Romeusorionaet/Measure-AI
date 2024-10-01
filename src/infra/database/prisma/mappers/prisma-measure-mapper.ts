import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Measure } from "@/domain/vision-meter/enterprise/entities/measure";
import { MeasureType } from "@/domain/vision-meter/enterprise/entities/measure-type";
import { Prisma, Measure as PrismaMeasure } from "@prisma/client";

export class PrismaMeasureMapper {
  static toDomain(raw: PrismaMeasure): Measure {
    const measureType: MeasureType = raw.measureType as MeasureType;

    return Measure.create(
      {
        customerId: new UniqueEntityID(raw.customerId),
        hasConfirmed: raw.hasConfirmed,
        imageUrl: raw.imageUrl,
        measureDatetime: raw.measureDatetime.toISOString(),
        measureType,
        measureValue: raw.measureValue,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(measure: Measure): Prisma.MeasureUncheckedCreateInput {
    return {
      id: measure.id.toString(),
      customerId: measure.customerId.toString(),
      hasConfirmed: measure.hasConfirmed,
      imageUrl: measure.imageUrl,
      measureDatetime: measure.measureDatetime,
      measureType: measure.measureType,
      measureValue: measure.measureValue,
      createdAt: measure.createdAt,
      updatedAt: measure.updatedAt,
    };
  }
}
