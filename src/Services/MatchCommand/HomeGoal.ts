import { Match } from '../../Entities/Match'

export function homeGoalCommand (match: Match) {
  match.score.home = match.score.home + 1
  return match
}
