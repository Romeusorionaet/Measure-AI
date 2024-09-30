import { FastifyRequest, FastifyReply } from "fastify";
import { confirmBodySchema } from "../schemas/confirm-body-schema";
import { z } from "zod";
import { makeVerifyCodeReadAndSaveUseCase } from "src/domain/vision-meter/application/use-cases/factories/make-verify-code-read-and-save-use-case";
import { ReadNotFoundError } from "src/domain/vision-meter/application/use-cases/errors/read-not-found-error";
import { ReadingAlreadyConfirmedError } from "src/domain/vision-meter/application/use-cases/errors/reading-already-confirmed-error";

export async function confirm(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { confirmed_value, measure_uuid } = confirmBodySchema.parse(
      request.body,
    );

    const verifyCodeReadAndSaveUseCase = makeVerifyCodeReadAndSaveUseCase();

    const result = await verifyCodeReadAndSaveUseCase.execute({
      measureId: measure_uuid,
      confirmedValue: confirmed_value,
    });

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case ReadNotFoundError:
          return reply.status(404).send({
            error_code: "MEASURE_NOT_FOUND",
            error_description: err.message,
          });
        case ReadingAlreadyConfirmedError:
          return reply.status(409).send({
            error_code: "CONFIRMATION_DUPLICATE",
            error_description: err.message,
          });
        default:
          throw new Error(err.message);
      }
    }

    return reply.status(200).send({
      success: true,
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
