import { Either, right } from "src/core/either";
import { MeasureType } from "../../enterprise/entities/measure-type";
import { MeasureRepository } from "../repositories/measure-repository";
import { Customer } from "../../enterprise/entities/customer";
import { CustomerRepository } from "../repositories/cusotmer-repository";
import { Measure } from "../../enterprise/entities/measure";

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
    private customerRepository: CustomerRepository,
  ) {}

  async execute({
    imageUrl,
    customerCode,
    measureDatetime,
    measureType,
    measureValue,
  }: CreateMeasureUseCaseRequest): Promise<CreateMeasureUseCaseResponse> {
    // TODO esta criando dois custumer, 1 para cada type, preciso garantir que seja só 1
    const customer = Customer.create({
      customerCode,
    });

    const measure = Measure.create({
      customerId: customer.id,
      hasConfirmed: false,
      imageUrl,
      measureDatetime,
      measureType,
      measureValue,
    });

    await this.customerRepository.create(customer);

    const { measureId } = await this.measureRepository.create(measure);

    return right({
      measureId,
    });
  }
}
