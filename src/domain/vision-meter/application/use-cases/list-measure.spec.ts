import { InMemoryCustomersRepository } from "test/repositories/in-memory-customers-repository";
import { InMemoryMeasureDataRepository } from "test/repositories/in-memory-measures-data-repository";
import { ListMeasuresUseCase } from "./list-measures";
import { makeCustomer } from "test/factories/make-customer";
import { makeMeasure } from "test/factories/make-measure";
import { InMemoryMeasuresRepository } from "test/repositories/in-memory-measures-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { MeasureType } from "../../enterprise/entities/measure-type";
import { MeasuresNotFoundError } from "./errors/measures-not-found-error";

let inMemoryCustomersRepository: InMemoryCustomersRepository;
let inMemoryMeasuresRepository: InMemoryMeasuresRepository;
let measureData: InMemoryMeasureDataRepository;
let sut: ListMeasuresUseCase;

describe("List measure", () => {
  beforeEach(() => {
    measureData = new InMemoryMeasureDataRepository();
    inMemoryCustomersRepository = new InMemoryCustomersRepository(measureData);

    inMemoryMeasuresRepository = new InMemoryMeasuresRepository(
      measureData,
      inMemoryCustomersRepository,
    );

    sut = new ListMeasuresUseCase(inMemoryCustomersRepository);
  });

  test("should be able to list all customer measure", async () => {
    const customer = makeCustomer({}, new UniqueEntityID("customer-id-01"));

    const measureWater = makeMeasure({
      customerId: customer.id,
      measureType: MeasureType.WATER,
    });

    const measureGas = makeMeasure({
      customerId: customer.id,
      measureType: MeasureType.GAS,
    });

    await Promise.all([
      inMemoryCustomersRepository.create(customer),
      inMemoryMeasuresRepository.create(measureWater),
      inMemoryMeasuresRepository.create(measureGas),
    ]);

    const result = await sut.execute({
      customerCode: customer.customerCode,
    });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.measures).toHaveLength(2);

      expect(result.value).toEqual(
        expect.objectContaining({
          measures: expect.arrayContaining([
            expect.objectContaining({ customerId: customer.id }),
          ]),
        }),
      );
    }
  });

  test("should be able to list customer measure by type", async () => {
    const customer = makeCustomer({}, new UniqueEntityID("customer-id-01"));

    const measureWater = makeMeasure({
      customerId: customer.id,
      measureType: MeasureType.WATER,
    });

    const measureGas = makeMeasure({
      customerId: customer.id,
      measureType: MeasureType.GAS,
    });

    await Promise.all([
      inMemoryCustomersRepository.create(customer),
      inMemoryMeasuresRepository.create(measureWater),
      inMemoryMeasuresRepository.create(measureGas),
    ]);

    const result = await sut.execute({
      customerCode: customer.customerCode,
      measureType: MeasureType.WATER,
    });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.measures).toHaveLength(1);
    }
  });

  test("should be able to return error by measure not find", async () => {
    const customer = makeCustomer({}, new UniqueEntityID("customer-id-01"));

    const measureWater = makeMeasure({
      customerId: customer.id,
      measureType: MeasureType.WATER,
    });

    await Promise.all([
      inMemoryCustomersRepository.create(customer),
      inMemoryMeasuresRepository.create(measureWater),
    ]);

    const result = await sut.execute({
      customerCode: customer.customerCode,
      measureType: MeasureType.GAS,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(MeasuresNotFoundError);
  });
});
