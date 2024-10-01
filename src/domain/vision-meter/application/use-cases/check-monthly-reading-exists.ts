import { MeasureRepository } from "../repositories/measure-repository";
import { MeasureType } from "../../enterprise/entities/measure-type";
import { ReadingTypeAlreadyExistsError } from "./errors/reading-type-already-exits-error";
import { Either, left, right } from "@/core/either";

interface CheckMonthlyReadingExistsUseCaseRequest {
  measureDatetime: string;
  measureType: MeasureType;
  customerCode: string;
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
    customerCode,
  }: CheckMonthlyReadingExistsUseCaseRequest): Promise<CheckMonthlyReadingExistsUseCaseResponse> {
    const existMeasure = await this.measureRepository.findByMatchParams(
      measureType,
      measureDatetime,
      customerCode,
    );

    if (existMeasure) {
      return left(new ReadingTypeAlreadyExistsError());
    }

    return right({});
  }
}
