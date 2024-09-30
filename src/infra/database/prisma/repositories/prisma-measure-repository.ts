import { MeasureRepository } from "src/domain/vision-meter/application/repositories/measure-repository";
import { Measure } from "src/domain/vision-meter/enterprise/entities/measure";
import { MeasureType } from "src/domain/vision-meter/enterprise/entities/measure-type";
import { prisma } from "src/infra/service/prisma";
import { PrismaMeasureMapper } from "../mappers/prisma-measure-mapper";

export class PrismaMeasureRepository implements MeasureRepository {
  async findByTypeAndDateTime(
    measureType: MeasureType,
    measureDatetime: string,
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

  async create(measure: Measure): Promise<{ measureId: string }> {
    const data = PrismaMeasureMapper.toPrisma(measure);

    const result = await prisma.measure.create({
      data,
    });

    return { measureId: result.id };
  }
}
