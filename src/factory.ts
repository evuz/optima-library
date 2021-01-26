import { Config, createConfig } from './Entities/Config'
import { DemoMatchFactory } from './Factories/Match/DemoMatchFactory'
import { FinishMatchService } from './Services/FinishMatchService'
import { GetSummaryService } from './Services/GetSummaryService'
import { MatchService } from './Services/MatchService'
import { ScoreboardService } from './Services/ScoreboardService'
import { RandomMathGeneratorStrategy } from './Strategies/MatchGenerator/RandomStrategy'
import { RandomMatchResolverStrategy } from './Strategies/MatchResolver/RandomMatchResolverStrategy'
import { FinishedMatchesUseCase } from './UseCases/FinishedMatchesUseCase'
import { ScoreboardUseCase } from './UseCases/ScoreboardUseCase'
import { Domain } from './Utils/Domain'
import { spainTeams } from './Utils/TeamsGenerator'

const domainMode = ['demo'] as const

type DomainMode = typeof domainMode[number]

export function createDomain (mode: DomainMode = 'demo') {
  if (!domainMode.includes(mode)) {
    throw Error(`mode ${mode} is not a valid mode`)
  }

  const config: Config = createConfig({
    matchDuration: 3 * 60, // 3 min
    resultsPageSize: 10
  })
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
