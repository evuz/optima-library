import { EventType } from '../../Entities/EventMatch'
import { Match } from '../../Entities/Match'
import { awayGoalCommand } from './AwayGoal'
import { finishCommand } from './Finish'
import { homeGoalCommand } from './HomeGoal'
import { startCommand } from './Start'

export class MatchCommand {
  constructor (private match: Match, private command: EventType) {}

  execute (matches: Match[]): Match[] {
    this.updateMatch()

    return this.updateMatches(matches)
  }

  updateMatch () {
    switch (this.command) {
      case EventType.Start:
        return startCommand(this.match)
      case EventType.AwayGoal:
        return awayGoalCommand(this.match)
      case EventType.HomeGoal:
        return homeGoalCommand(this.match)
      case EventType.Finish:
        return finishCommand(this.match)
      case EventType.Empty:
        return this.match
      default:
        throw Error('This command does not exist')
    }
  }

  updateMatches (matches: Match[]) {
    switch (this.command) {
      case EventType.AwayGoal:
      case EventType.HomeGoal:
      case EventType.Empty:
        return matches
      case EventType.Start:
        return matches.concat(this.match)
      case EventType.Finish:
        return matches.filter(match => match.id !== this.match.id)
      default:
        throw Error('This command does not exist')
    }
  }
}
