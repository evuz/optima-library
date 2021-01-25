export function updateClass<T> (that: T, props: Partial<T>): T {
  if (!props) {
    throw Error('Cannot initialize an Entity as null')
  }

  const keys = Object.keys(props || {})
  keys.forEach((key) => {
    that[key] = props[key]
  })

  return that
}
