import { UseCaseError } from "src/core/errors/use-case-error";

export class ReadingAlreadyConfirmedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Leitura já confirmada`);
  }
}
