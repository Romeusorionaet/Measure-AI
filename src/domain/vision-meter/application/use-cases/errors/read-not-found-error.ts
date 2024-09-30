import { UseCaseError } from "src/core/errors/use-case-error";

export class ReadNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Leitura não encontrada`);
  }
}
