import { UseCase } from './UseCase'

type UseCases = Record<string, UseCase<unknown>>

export class Domain<T extends UseCases> {
  constructor (private useCases: T) {}

  useCase<U extends keyof T> (useCase: U): T[U] {
    if (!this.useCases[useCase]) {
      throw Error(`${useCase} doesn't exist in Domain`)
    }
    return this.useCases[useCase]
  }
}
