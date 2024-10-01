import { FastifyRequest, FastifyReply } from "fastify";
import { querySchema } from "../schemas/query-schema";
import { z } from "zod";
import { MeasurePresenter } from "../presenters/measure-presenter";
import { makeListMeasuresUseCase } from "@/domain/vision-meter/application/use-cases/factories/make-list-measures-use-case";
import { MeasuresNotFoundError } from "@/domain/vision-meter/application/use-cases/errors/measures-not-found-error";

interface ListMeasuresParams {
  customer_code: string;
}

export async function listMeasures(
  request: FastifyRequest<{
    Params: ListMeasuresParams;
  }>,
  reply: FastifyReply,
) {
  try {
    const { customer_code } = request.params;
    const { measure_type } = querySchema.parse(request.query);

    const listMeasuresUseCase = makeListMeasuresUseCase();

    const result = await listMeasuresUseCase.execute({
      customerCode: customer_code,
      measureType: measure_type,
    });

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case MeasuresNotFoundError:
          return reply.status(404).send({
            error_code: "MEASURES_NOT_FOUND",
            error_description: err.message,
          });
        default:
          throw new Error(err.message);
      }
    }

    return reply.status(200).send({
      customer_code,
      measures: result.value.measures.map(MeasurePresenter.toHTTP),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error_code: "INVALID_TYPE",
        error_description: "Parâmetro measure type diferente de WATER ou GAS",
      });
    }
  }
}
