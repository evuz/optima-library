import { createConfig } from '../Config'

describe('Config', () => {
  test('should create a config', () => {
    const config = createConfig({ resultsPageSize: 10 })
    expect(config).toBeTruthy()
  })

  test('should get config property', () => {
    const config = createConfig({ demo: { matchDuration: 20, timeBetweenMatches: 5 }, resultsPageSize: undefined })
    expect(config.demo.matchDuration).toEqual(20)
    expect(config.resultsPageSize).toEqual(undefined)
  })

  test('should set new config', () => {
    const config = createConfig({ resultsPageSize: undefined })
    expect(config.resultsPageSize).toEqual(undefined)
    config.resultsPageSize = 10
    expect(config.resultsPageSize).toEqual(10)
  })

  test('should fail when property is not exist', () => {
    const config = createConfig({ resultsPageSize: 10 })

    function error () {
      return (<any>config).fail
    }

    expect(error).toThrowError(/fail/)
  })
})
