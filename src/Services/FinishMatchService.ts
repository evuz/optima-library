import { Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'
import { EventType } from '../Entities/EventMatch'

import { MatchFactory } from '../Factories/Match/MatchFactory'
import { MatchService } from './MatchService'

export class FinishMatchService {
  private subscriptions: Subscription[] = []

  constructor (private matchService: MatchService, private matchFactory: MatchFactory) {}

  public run () {
    this.subscriptions[0] = this.matchFactory.events$.pipe(filter(ev => ev.type === EventType.Finish))
      .subscribe(ev => {
        this.matchService.addFinished(ev.match)
      })
  }

  public destroy () {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
