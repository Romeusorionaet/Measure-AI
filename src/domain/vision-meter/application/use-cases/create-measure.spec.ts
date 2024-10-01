import { InMemoryCustomersRepository } from "test/repositories/in-memory-customers-repository";
import { InMemoryMeasureDataRepository } from "test/repositories/in-memory-measures-data-repository";
import { CreateMeasureUseCase } from "./create-measure";
import { InMemoryMeasuresRepository } from "test/repositories/in-memory-measures-repository";
import { CreateCustomerUseCase } from "./create-customer";
import { makeCustomer } from "test/factories/make-customer";
import { MeasureType } from "../../enterprise/entities/measure-type";

let inMemoryCustomersRepository: InMemoryCustomersRepository;
let measureData: InMemoryMeasureDataRepository;
let inMemoryMeasuresRepository: InMemoryMeasuresRepository;
let createCustomerUseCase: CreateCustomerUseCase;
let sut: CreateMeasureUseCase;

describe("Create measure", () => {
  beforeEach(() => {
    measureData = new InMemoryMeasureDataRepository();

    inMemoryCustomersRepository = new InMemoryCustomersRepository(measureData);
    inMemoryMeasuresRepository = new InMemoryMeasuresRepository(
      measureData,
      inMemoryCustomersRepository,
    );
    createCustomerUseCase = new CreateCustomerUseCase(
      inMemoryCustomersRepository,
    );

    sut = new CreateMeasureUseCase(
      inMemoryMeasuresRepository,
      createCustomerUseCase,
    );
  });

  test("should be able to create a measure and return a measureId", async () => {
    const customer = makeCustomer();

    const result = await sut.execute({
      imageUrl: "https://img-test.com",
      customerCode: customer.customerCode,
      measureDatetime: "2024-09-30T22:02:00Z",
      measureType: MeasureType.WATER,
      measureValue: 222422,
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryMeasuresRepository.measureData.items).toHaveLength(1);
    expect(result.value).toEqual(
      expect.objectContaining({ measureId: expect.any(String) }),
    );
  });
});
