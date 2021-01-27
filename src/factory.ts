/* eslint-disable no-redeclare */
import { Config, createConfig } from './Entities/Config'
import { DemoMatchFactory } from './Factories/Match/DemoMatchFactory'
import { ManualMatchFactory } from './Factories/Match/ManualMatchFactory'
import { FinishMatchService } from './Services/FinishMatchService'
import { GetSummaryService } from './Services/GetSummaryService'
import { MatchService } from './Services/MatchService'
import { ScoreboardService } from './Services/ScoreboardService'
import { RandomMathGeneratorStrategy } from './Strategies/MatchGenerator/RandomStrategy'
import { RandomMatchResolverStrategy } from './Strategies/MatchResolver/RandomMatchResolverStrategy'
import { FinishedMatchesUseCase } from './UseCases/FinishedMatchesUseCase'
import { FinishtMatchUseCase } from './UseCases/FinishMatchUseCase'
import { ScoreboardUseCase } from './UseCases/ScoreboardUseCase'
import { StartMatchUseCase } from './UseCases/StartMatchUseCase'
import { UpdateScoreUseCase } from './UseCases/UpdateScoreUseCase'
import { Domain } from './Utils/Domain'
import { spainTeams } from './Utils/TeamsGenerator'

type DomainMap = {
  demo: ReturnType<typeof createDemoDomain>
  manual: ReturnType<typeof createManualDomain>
}

type TypesDomain = keyof DomainMap
type AllDomain = DomainMap['demo'] | DomainMap['manual']

export function createDomain (mode: 'demo'): DomainMap['demo']
export function createDomain (mode: 'manual'): DomainMap['manual']
export function createDomain (mode: TypesDomain): AllDomain {
  const config: Config = createConfig({
    resultsPageSize: 10
  })

  switch (mode) {
    case 'demo':
      config.demo = {
        matchDuration: 3 * 60, // 3 min
        timeBetweenMatches: 30 // 30 sec
      }
      return createDemoDomain(config)
    case 'manual':
      return createManualDomain(config)
    default:
      throw Error(`mode ${mode} is not a valid mode`)
  }
}

function createDemoDomain (config: Config) {
  const matchGenerator = new RandomMathGeneratorStrategy(config)
  const matchResolver = new RandomMatchResolverStrategy(config)

  const matchFactory = new DemoMatchFactory(spainTeams(), matchGenerator, matchResolver)

  const matchService = new MatchService()
  const scoreboardService = new ScoreboardService(matchFactory)
  const getSummaryService = new GetSummaryService(config, matchService)
  const finishedService = new FinishMatchService(matchService, matchFactory)

  return new Domain({
    scoreboard: new ScoreboardUseCase(scoreboardService),
    summary: new FinishedMatchesUseCase(getSummaryService, finishedService)
  })
}

function createManualDomain (config: Config) {
  const matchFactory = new ManualMatchFactory()

  const matchService = new MatchService()
  const scoreboardService = new ScoreboardService(matchFactory)
  const getSummaryService = new GetSummaryService(config, matchService)
  const finishedService = new FinishMatchService(matchService, matchFactory)

  return new Domain({
    scoreboard: new ScoreboardUseCase(scoreboardService),
    summary: new FinishedMatchesUseCase(getSummaryService, finishedService),
    startGame: new StartMatchUseCase(matchFactory),
    finishGame: new FinishtMatchUseCase(matchFactory),
    updateScore: new UpdateScoreUseCase(matchFactory)
  })
}
