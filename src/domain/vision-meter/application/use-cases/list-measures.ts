import { Either, left, right } from "src/core/either";
import { Measure } from "../../enterprise/entities/measure";
import { MeasuresNotFoundError } from "./errors/measures-not-found-error";
import { MeasureType } from "../../enterprise/entities/measure-type";
import { CustomerRepository } from "../repositories/cusotmer-repository";

interface ListMeasuresUseCaseRequest {
  customerCode: string;
  measureType?: MeasureType;
}

type ListMeasuresUseCaseResponse = Either<
  MeasuresNotFoundError,
  { measures: Measure[] }
>;

export class ListMeasuresUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    customerCode,
    measureType,
  }: ListMeasuresUseCaseRequest): Promise<ListMeasuresUseCaseResponse> {
    const measures = await this.customerRepository.filterByCodeAndType(
      customerCode,
      measureType,
    );

    const noMeasures = measures.length === 0;

    if (noMeasures) {
      return left(new MeasuresNotFoundError());
    }

    return right({ measures });
  }
}
