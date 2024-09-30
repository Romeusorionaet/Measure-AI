import { Prisma, Measure as PrismaMeasure } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Measure } from "src/domain/vision-meter/enterprise/entities/measure";
import { MeasureType } from "src/domain/vision-meter/enterprise/entities/measure-type";

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
      createdAt: measure.createdAt,
      updatedAt: measure.updatedAt,
    };
  }
}
