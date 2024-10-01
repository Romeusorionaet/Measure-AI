import { UseCaseError } from "@/core/errors/use-case-error";

export class MeasuresNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Nenhum registro encontrado`);
  }
}
