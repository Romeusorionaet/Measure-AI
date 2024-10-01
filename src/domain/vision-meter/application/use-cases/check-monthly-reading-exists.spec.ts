import { InMemoryCustomersRepository } from "test/repositories/in-memory-customers-repository";
import { InMemoryMeasureDataRepository } from "test/repositories/in-memory-measures-data-repository";
import { CheckMonthlyReadingExistsUseCase } from "./check-monthly-reading-exists";
import { InMemoryMeasuresRepository } from "test/repositories/in-memory-measures-repository";
import { makeCustomer } from "test/factories/make-customer";
import { makeMeasure } from "test/factories/make-measure";
import { MeasureType } from "../../enterprise/entities/measure-type";
import { ReadingTypeAlreadyExistsError } from "./errors/reading-type-already-exits-error";

let inMemoryCustomersRepository: InMemoryCustomersRepository;
let measureData: InMemoryMeasureDataRepository;
let inMemoryMeasuresRepository: InMemoryMeasuresRepository;
let sut: CheckMonthlyReadingExistsUseCase;

describe("Check monthly reading exists", () => {
  beforeEach(() => {
    measureData = new InMemoryMeasureDataRepository();
    inMemoryCustomersRepository = new InMemoryCustomersRepository(measureData);
    inMemoryMeasuresRepository = new InMemoryMeasuresRepository(
      measureData,
      inMemoryCustomersRepository,
    );

    sut = new CheckMonthlyReadingExistsUseCase(inMemoryMeasuresRepository);
  });

  test("should be able to pass this month reading", async () => {
    const customer = makeCustomer();

    await inMemoryCustomersRepository.create(customer);

    const measure = makeMeasure({
      customerId: customer.id,
      measureDatetime: "2024-09-30T22:40:00Z",
      measureType: MeasureType.WATER,
    });

    await inMemoryMeasuresRepository.create(measure);

    const result = await sut.execute({
      customerCode: customer.customerCode,
      measureDatetime: measure.measureDatetime,
      measureType: MeasureType.GAS,
    });

    expect(result.isRight()).toBeTruthy();
  });

  test("Should not be able to pass a reading of the same type in the same month", async () => {
    const customer = makeCustomer();

    await inMemoryCustomersRepository.create(customer);

    const measure = makeMeasure({
      customerId: customer.id,
      measureDatetime: "2024-09-30T22:40:00Z",
      measureType: MeasureType.WATER,
    });

    await inMemoryMeasuresRepository.create(measure);

    const result = await sut.execute({
      customerCode: customer.customerCode,
      measureDatetime: measure.measureDatetime,
      measureType: measure.measureType,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ReadingTypeAlreadyExistsError);
  });

  test("should be able to pass the same reading type in different month", async () => {
    const customer = makeCustomer();

    await inMemoryCustomersRepository.create(customer);

    const measure = makeMeasure({
      customerId: customer.id,
      measureDatetime: "2024-09-30T22:40:00Z",
      measureType: MeasureType.WATER,
    });

    await inMemoryMeasuresRepository.create(measure);

    const result = await sut.execute({
      customerCode: customer.customerCode,
      measureDatetime: "2024-10-30T22:40:00Z",
      measureType: MeasureType.WATER,
    });

    expect(result.isRight()).toBeTruthy();
  });
});
