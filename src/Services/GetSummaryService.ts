import { Config } from '../Entities/Config'
import { MatchService } from './MatchService'

export class GetSummaryService {
  constructor (private config: Config, private matchSrv: MatchService) {}

  execute (page = 0) {
    if (!this.matchSrv.finished) {
      return Promise.resolve([])
    }

    const { resultsPageSize } = this.config
    const firstElement = page * resultsPageSize
    const lastElement = firstElement + resultsPageSize

    return Promise.resolve(this.matchSrv.finished.slice(firstElement, lastElement))
  }
}
