import { Match } from '../Entities/Match'
import { ExecutableUseCase } from '../Utils/UseCase'
import { GetSummaryService } from '../Services/GetSummaryService'
import { FinishMatchService } from '../Services/FinishMatchService'

export class FinishedMatchesUseCase implements ExecutableUseCase<Match[]> {
  constructor (private service: GetSummaryService, private finishedService: FinishMatchService) {
    this.finishedService.run()
  }

  execute (page?: number) {
    return this.service.execute(page)
  }
}
