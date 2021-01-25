import { Config } from '../../Entities/Config'
import { Match } from '../../Entities/Match'
import { GetSummaryService } from '../GetSummaryService'
import { MatchService } from '../MatchService'

describe('GetSummaryService', () => {
  const config: Config = {
    resultsPageSize: 2,
    matchDuration: undefined
  }

  const results = [
    new Match(<any>{}),
    new Match(<any>{}),
    new Match(<any>{}),
    new Match(<any>{}),
    new Match(<any>{}),
    new Match(<any>{})
  ]

  test('should return first results', async () => {
    const matchSrv = new MatchService()
    matchSrv.results = results
    const service = new GetSummaryService(config, matchSrv)

    const summary = await service.execute()
    expect(summary).toEqual(results.slice(0, 2))
  })

  test('should return second page', async () => {
    const matchSrv = new MatchService()
    matchSrv.results = results
    const service = new GetSummaryService(config, matchSrv)

    const summary = await service.execute(1)
    expect(summary).toEqual(results.slice(2, 4))
  })

  test('should return empty array when result is null', async () => {
    const matchSrv = new MatchService()
    const service = new GetSummaryService(config, matchSrv)

    const summary = await service.execute()
    expect(summary).toEqual([])
  })
})
