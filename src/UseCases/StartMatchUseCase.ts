import { Match } from '../Entities/Match'
import { Team } from '../Entities/Team'
import { ManualMatchFactory } from '../Factories/Match/ManualMatchFactory'
import { ExecutableUseCase } from '../Utils/UseCase'

export class StartMatchUseCase implements ExecutableUseCase<Match> {
  constructor (private matchFactory: ManualMatchFactory) {}

  execute (home: Team, away: Team) {
    return this.matchFactory.start(home, away)
  }
}
