import { InMemoryCustomersRepository } from "test/repositories/in-memory-customers-repository";
import { CreateCustomerUseCase } from "./create-customer";
import { InMemoryMeasureDataRepository } from "test/repositories/in-memory-measures-data-repository";
import { makeCustomer } from "test/factories/make-customer";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

let inMemoryCustomersRepository: InMemoryCustomersRepository;
let measureData: InMemoryMeasureDataRepository;
let sut: CreateCustomerUseCase;

describe("Create customer", () => {
  beforeEach(() => {
    measureData = new InMemoryMeasureDataRepository();
    inMemoryCustomersRepository = new InMemoryCustomersRepository(measureData);

    sut = new CreateCustomerUseCase(inMemoryCustomersRepository);
  });

  test("should be able to create a customer", async () => {
    const result = await sut.execute({
      customerCode: "123456",
    });

    expect(inMemoryCustomersRepository.customers).toHaveLength(1);
    expect(result).toEqual(
      expect.objectContaining({
        customerCode: "123456",
      }),
    );
  });

  test("should not be able to create a customer twice", async () => {
    const customer = makeCustomer(
      { customerCode: "123" },
      new UniqueEntityID("customer-id-01"),
    );

    await inMemoryCustomersRepository.create(customer);

    const result = await sut.execute({
      customerCode: "123",
    });

    expect(inMemoryCustomersRepository.customers).toHaveLength(1);
    expect(result).toEqual(
      expect.objectContaining({
        id: new UniqueEntityID("customer-id-01"),
        customerCode: "123",
      }),
    );
  });
});
