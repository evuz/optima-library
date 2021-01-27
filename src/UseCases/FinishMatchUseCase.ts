import { Match } from '../Entities/Match'
import { ManualMatchFactory } from '../Factories/Match/ManualMatchFactory'
import { ExecutableUseCase } from '../Utils/UseCase'

export class FinishtMatchUseCase implements ExecutableUseCase<Match> {
  constructor (private matchFactory: ManualMatchFactory) {}

  execute (matchId: Match['id']) {
    return this.matchFactory.finish(matchId)
  }
}
