import { Config } from '../Entities/Config'
import { MatchService } from './MatchService'

export class GetSummaryService {
  constructor (private config: Config, private matchSrv: MatchService) {}

  execute (page = 0) {
    if (!this.matchSrv.results) {
      return Promise.resolve([])
    }

    const { resultsPageSize } = this.config
    const firstElement = page * resultsPageSize
    const lastElement = firstElement + resultsPageSize

    return Promise.resolve(this.matchSrv.results.slice(firstElement, lastElement))
  }
}
