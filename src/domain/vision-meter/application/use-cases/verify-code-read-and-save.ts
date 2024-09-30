import { Either, left, right } from "src/core/either";
import { MeasureRepository } from "../repositories/measure-repository";
import { ReadNotFoundError } from "./errors/read-not-found-error";
import { ReadingAlreadyConfirmedError } from "./errors/reading-already-confirmed-error";

interface VerifyCodeReadAndSaveUseCaseRequest {
  measureId: string;
  confirmedValue: number;
}

type VerifyCodeReadAndSaveUseCaseResponse = Either<
  ReadNotFoundError | ReadingAlreadyConfirmedError,
  { success: true }
>;

export class VerifyCodeReadAndSaveUseCase {
  constructor(private measureRepository: MeasureRepository) {}

  async execute({
    measureId,
    confirmedValue,
  }: VerifyCodeReadAndSaveUseCaseRequest): Promise<VerifyCodeReadAndSaveUseCaseResponse> {
    const measure = await this.measureRepository.findById(measureId);

    if (!measure) {
      return left(new ReadNotFoundError());
    }

    if (measure.hasConfirmed) {
      return left(new ReadingAlreadyConfirmedError());
    }

    const measureUpdated = measure.update({
      hasConfirmed: true,
      measureValue: confirmedValue,
    });

    await this.measureRepository.update(measureUpdated);

    return right({ success: true });
  }
}
