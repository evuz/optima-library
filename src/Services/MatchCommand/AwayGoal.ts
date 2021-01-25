import { Match } from '../../Entities/Match'

export function awayGoalCommand (match: Match) {
  match.score.away = match.score.away + 1
  return match
}
