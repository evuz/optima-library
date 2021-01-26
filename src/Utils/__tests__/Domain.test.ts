import { of } from 'rxjs'

import { ExecutableUseCase, ObservableUseCase } from '../UseCase'
import { Domain } from '../Domain'

export class FooUseCase implements ExecutableUseCase<string> {
  execute () {
    return Promise.resolve('foo')
  }
}

export class BarUseCase implements ObservableUseCase<string> {
  execute () {
    return of('bar')
  }
}

describe('Domain', () => {
  test('should create domain', () => {
    const domain = new Domain({ foo: new FooUseCase(), bar: new BarUseCase() })
    expect(domain).toBeTruthy()
  })

  test('should get use case', () => {
    const domain = new Domain({ foo: new FooUseCase(), bar: new BarUseCase() })
    expect(domain.useCase('bar')).toBeTruthy()
    expect(domain.useCase('foo')).toBeTruthy()
  })

  test('should throw error if use case does not exist', () => {
    const domain = new Domain({ foo: new FooUseCase(), bar: new BarUseCase() })

    function error () {
      expect(domain.useCase(<any>'baz')).toBeTruthy()
    }

    expect(error).toThrowError(/doesn't exist/)
  })
})
