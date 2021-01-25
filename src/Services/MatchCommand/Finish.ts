import { Match, MatchState } from '../../Entities/Match'

export function finishCommand (match: Match) {
  match.state = MatchState.Finish
  return match
}
