import { MeasureRepository } from "@/domain/vision-meter/application/repositories/measure-repository";
import { PrismaMeasureMapper } from "../mappers/prisma-measure-mapper";
import { Measure } from "@/domain/vision-meter/enterprise/entities/measure";
import { MeasureType } from "@/domain/vision-meter/enterprise/entities/measure-type";
import { prisma } from "@/infra/service/prisma";

export class PrismaMeasureRepository implements MeasureRepository {
  async create(measure: Measure): Promise<{ measureId: string }> {
    const data = PrismaMeasureMapper.toPrisma(measure);

    const result = await prisma.measure.create({
      data,
    });

    return { measureId: result.id };
  }

  async findByMatchParams(
    measureType: MeasureType,
    measureDatetime: string,
    customerCode: string,
  ): Promise<boolean> {
    const dateObj = new Date(measureDatetime);

    const startOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const endOfMonth = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth() + 1,
      0,
    );

    const result = await prisma.measure.findFirst({
      where: {
        Customer: {
          customerCode,
        },
        measureType,
        measureDatetime: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    if (!result) {
      return false;
    }

    return true;
  }

  async findById(measureId: string): Promise<Measure | null> {
    const measure = await prisma.measure.findUnique({
      where: { id: measureId },
    });

    if (!measure) {
      return null;
    }

    return PrismaMeasureMapper.toDomain(measure);
  }

  async update(measure: Measure): Promise<void> {
    const data = PrismaMeasureMapper.toPrisma(measure);

    await prisma.measure.update({
      where: { id: data.id },
      data,
    });
  }
}
