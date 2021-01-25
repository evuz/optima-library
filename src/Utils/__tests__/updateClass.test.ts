import { updateClass } from '../updateClass'

class Foo {
  bar: number;
  baz: string;
}

describe('updateClass', () => {
  test('should update class properties', () => {
    const instance = new Foo()
    updateClass(instance, { bar: 10 })
    expect(instance.bar).toEqual(10)
  })

  test('should throw error if props is null o undefined', () => {
    const instance = new Foo()

    function nullError () {
      updateClass(instance, null)
    }

    function undefinedError () {
      updateClass(instance, undefined)
    }

    expect(nullError).toThrowError()
    expect(undefinedError).toThrowError()
  })
})
