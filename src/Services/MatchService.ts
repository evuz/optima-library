import { Match } from '../Entities/Match'

export class MatchService {
  finished: Match[] = []

  addFinished (match: Match) {
    this.finished.unshift(match)
  }
}
