import { InMemoryCustomersRepository } from "test/repositories/in-memory-customers-repository";
import { InMemoryMeasureDataRepository } from "test/repositories/in-memory-measures-data-repository";
import { InMemoryMeasuresRepository } from "test/repositories/in-memory-measures-repository";
import { VerifyCodeReadAndSaveUseCase } from "./verify-code-read-and-save";
import { makeCustomer } from "test/factories/make-customer";
import { makeMeasure } from "test/factories/make-measure";
import { MeasureType } from "../../enterprise/entities/measure-type";
import { ReadNotFoundError } from "./errors/read-not-found-error";
import { ReadingAlreadyConfirmedError } from "./errors/reading-already-confirmed-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryCustomersRepository: InMemoryCustomersRepository;
let measureData: InMemoryMeasureDataRepository;
let inMemoryMeasuresRepository: InMemoryMeasuresRepository;
let sut: VerifyCodeReadAndSaveUseCase;

describe("Verify code read and save", () => {
  beforeEach(() => {
    measureData = new InMemoryMeasureDataRepository();

    inMemoryCustomersRepository = new InMemoryCustomersRepository(measureData);
    inMemoryMeasuresRepository = new InMemoryMeasuresRepository(
      measureData,
      inMemoryCustomersRepository,
    );

    sut = new VerifyCodeReadAndSaveUseCase(inMemoryMeasuresRepository);
  });

  test("should be able to verify code read and confirm measure", async () => {
    const customer = makeCustomer({}, new UniqueEntityID("customer-id-01"));

    const measureWater = makeMeasure({
      customerId: customer.id,
      measureType: MeasureType.WATER,
      hasConfirmed: false,
    });

    await inMemoryCustomersRepository.create(customer);
    await inMemoryMeasuresRepository.create(measureWater);

    const result = await sut.execute({
      confirmedValue: measureWater.measureValue,
      measureId: measureWater.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(expect.objectContaining({ success: true }));
    expect(inMemoryMeasuresRepository.measureData.items[0]).toEqual(
      expect.objectContaining({ hasConfirmed: true }),
    );
  });

  test("should not be able to find read, should return error of not found read", async () => {
    const result = await sut.execute({
      confirmedValue: 123456,
      measureId: "measure-fake-id-01",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ReadNotFoundError);
  });

  test("should not be able to confirm the same measure twice, should return reading already confirmed error", async () => {
    const customer = makeCustomer();

    const measureWater = makeMeasure({
      customerId: customer.id,
      measureType: MeasureType.WATER,
      hasConfirmed: true,
    });

    await inMemoryCustomersRepository.create(customer);
    await inMemoryMeasuresRepository.create(measureWater);

    const result = await sut.execute({
      confirmedValue: measureWater.measureValue,
      measureId: measureWater.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ReadingAlreadyConfirmedError);
  });
});
