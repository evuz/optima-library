import { Config } from '../../../Entities/Config'
import { Team } from '../../../Entities/Team'
import { RandomMathGeneratorStrategy } from '../RandomStrategy'

describe('RandomMathGeneratorStrategy', () => {
  let strategy: RandomMathGeneratorStrategy
  let config: Config

  beforeEach(() => {
    config = {
      demo: { matchDuration: 5, timeBetweenMatches: 10 },
      resultsPageSize: null
    }
    strategy = new RandomMathGeneratorStrategy(config)
  })

  test('should generate matches', () => {
    const teams = Array.from({ length: 10 }).map(() => new Team(<any>{}))
    const matches = strategy.generate(teams)
    expect(matches.length).toEqual(5)
  })

  test('should generate matches even if the teams are odd', () => {
    const teams = Array.from({ length: 13 }).map(() => new Team(<any>{}))
    const matches = strategy.generate(teams)
    expect(matches.length).toEqual(6)
  })

  test('should generate the matches separated by the corresponding time', () => {
    const teams = Array.from({ length: 4 }).map(() => new Team(<any>{}))
    const matches = strategy.generate(teams)
    expect(matches[1].startTime - matches[0].startTime).toEqual(config.demo.timeBetweenMatches * 1000)
  })

  test('should generate differents matches', () => {
    const teams = Array.from({ length: 20 }).map(() => new Team(<any>{}))
    const firstMatches = strategy.generate(teams)
    const secondMatches = strategy.generate(teams)
    expect(firstMatches).not.toEqual(secondMatches)
  })

  test('should not modify teams', () => {
    const teams = Array.from({ length: 20 }).map(() => new Team(<any>{}))
    const clone = teams.slice()
    strategy.generate(teams)
    expect(teams).not.toBe(clone)
    expect(teams).toEqual(clone)
  })
})
