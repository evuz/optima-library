import { Match, MatchState } from '../../Entities/Match'
import { Score } from '../../Entities/Score'

export function startCommand (match: Match) {
  match.state = MatchState.Live
  match.score = new Score({ home: 0, away: 0 })
  return match
}
