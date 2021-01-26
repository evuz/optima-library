import { Match } from '../Entities/Match'
import { ScoreboardService } from '../Services/ScoreboardService'
import { ObservableUseCase } from '../Utils/UseCase'

export class ScoreboardUseCase implements ObservableUseCase<Match[]> {
  constructor (private service: ScoreboardService) {
    this.service.run()
  }

  execute () {
    return this.service.update$
  }
}
