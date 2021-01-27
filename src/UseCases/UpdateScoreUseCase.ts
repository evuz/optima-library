import { Match } from '../Entities/Match'
import { ManualMatchFactory } from '../Factories/Match/ManualMatchFactory'
import { ExecutableUseCase } from '../Utils/UseCase'

export class UpdateScoreUseCase implements ExecutableUseCase<Match> {
  constructor (private matchFactory: ManualMatchFactory) {}

  execute (matchId: Match['id'], score: [number, number]) {
    return this.matchFactory.updateScore(matchId, score)
  }
}
