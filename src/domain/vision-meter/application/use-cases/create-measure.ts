import { Either, right } from "@/core/either";
import { MeasureType } from "../../enterprise/entities/measure-type";
import { MeasureRepository } from "../repositories/measure-repository";
import { Measure } from "../../enterprise/entities/measure";
import { CreateCustomerUseCase } from "./create-customer";

interface CreateMeasureUseCaseRequest {
  imageUrl: string;
  customerCode: string;
  measureDatetime: string;
  measureType: MeasureType;
  measureValue: number;
}

type CreateMeasureUseCaseResponse = Either<
  null,
  {
    measureId: string;
  }
>;

export class CreateMeasureUseCase {
  constructor(
    private measureRepository: MeasureRepository,
    private createCustomerUseCase: CreateCustomerUseCase,
  ) {}

  async execute({
    imageUrl,
    customerCode,
    measureDatetime,
    measureType,
    measureValue,
  }: CreateMeasureUseCaseRequest): Promise<CreateMeasureUseCaseResponse> {
    const customer = await this.createCustomerUseCase.execute({ customerCode });

    const measure = Measure.create({
      customerId: customer.id,
      hasConfirmed: false,
      imageUrl,
      measureDatetime,
      measureType,
      measureValue,
    });

    const { measureId } = await this.measureRepository.create(measure);

    return right({
      measureId,
    });
  }
}
