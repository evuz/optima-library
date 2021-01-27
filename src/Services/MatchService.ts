import { Match } from '../Entities/Match'

export class MatchService {
  finished: Match[] = []

  addFinished (match: Match) {
    this.finished = this.finished.concat(match).sort((a, b) => {
      const aScore = this.totalScore(a)
      const bScore = this.totalScore(b)
      return bScore - aScore || a.startTime - b.startTime
    })
  }

  totalScore (match: Match) {
    return match.score.home + match.score.away
  }
}
