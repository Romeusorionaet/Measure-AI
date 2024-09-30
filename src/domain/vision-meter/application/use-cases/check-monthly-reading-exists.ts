import { Either, left, right } from "src/core/either";
import { MeasureRepository } from "../repositories/measure-repository";
import { MeasureType } from "../../enterprise/entities/measure-type";
import { ReadingTypeAlreadyExistsError } from "./errors/reading-type-already-exits-error";

interface CheckMonthlyReadingExistsUseCaseRequest {
  measureDatetime: string;
  measureType: MeasureType;
}

type CheckMonthlyReadingExistsUseCaseResponse = Either<
  ReadingTypeAlreadyExistsError,
  object
>;

export class CheckMonthlyReadingExistsUseCase {
  constructor(private measureRepository: MeasureRepository) {}

  async execute({
    measureType,
    measureDatetime,
  }: CheckMonthlyReadingExistsUseCaseRequest): Promise<CheckMonthlyReadingExistsUseCaseResponse> {
    const existMeasure = await this.measureRepository.findByTypeAndDateTime(
      measureType,
      measureDatetime,
    );

    if (existMeasure) {
      return left(new ReadingTypeAlreadyExistsError());
    }

    return right({});
  }
}
