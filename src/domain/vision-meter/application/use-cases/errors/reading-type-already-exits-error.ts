import { UseCaseError } from "@/core/errors/use-case-error";

export class ReadingTypeAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Já existe uma leitura para este tipo no mês atual`);
  }
}
