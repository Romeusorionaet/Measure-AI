import { FastifyRequest, FastifyReply } from "fastify";
import { makeCheckMonthlyReadingExistsUseCase } from "src/domain/vision-meter/application/use-cases/factories/make-check-monthly-exists-use-case";
import { makeCreateMeasureUseCase } from "src/domain/vision-meter/application/use-cases/factories/make-create-measure-use-case";
import { uploadBodySchema } from "../schemas/upload-body-schema";
import { ReadingTypeAlreadyExistsError } from "src/domain/vision-meter/application/use-cases/errors/reading-type-already-exits-error";
import { z } from "zod";
import { ImageProcessingService } from "src/infra/service/image-processing-service";

export async function upload(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { image, customer_code, measure_datetime, measure_type } =
      uploadBodySchema.parse(request.body);

    const isBase64 = /^data:image\/[a-z]+;base64,/.test(image);

    if (!isBase64) {
      return reply.status(400).send({
        error_code: "INVALID_DATA",
        error_description:
          "Os dados fornecidos no corpo da requisição são inválidos",
      });
    }

    const checkMonthlyReadingExistsUseCase =
      makeCheckMonthlyReadingExistsUseCase();

    const result = await checkMonthlyReadingExistsUseCase.execute({
      measureType: measure_type,
      measureDatetime: measure_datetime,
      customerCode: customer_code,
    });

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case ReadingTypeAlreadyExistsError:
          return reply.status(409).send({
            error_code: "DOUBLE_REPORT",
            error_description: err.message,
          });
        default:
          throw new Error(err.message);
      }
    }

    const imageProcessingService = new ImageProcessingService();

    const { uri, measureValue } =
      await imageProcessingService.processImage(image);

    const createMeasureUseCase = makeCreateMeasureUseCase();

    const resultMeasure = await createMeasureUseCase.execute({
      customerCode: customer_code,
      imageUrl: uri, // TODO uri is a temp image, i need to save the image and get the permanent url
      measureDatetime: measure_datetime,
      measureType: measure_type,
      measureValue,
    });

    return reply.status(200).send({
      image_url: uri,
      measure_value: measureValue,
      measure_uuid: resultMeasure.value?.measureId,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error_code: "INVALID_DATA",
        error_description:
          "Os dados fornecidos no corpo da requisição são inválidos",
      });
    }
  }
}
