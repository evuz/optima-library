import { ReplaySubject, Subscription } from 'rxjs'

import { Match } from '../Entities/Match'
import { MatchFactory } from '../Factories/Match/MatchFactory'
import { MatchCommand } from './MatchCommand/MatchCommand'

export class ScoreboardService {
  private scoreboard: Match[] = []

  private subscriptions: Subscription[] = []
  private subject = new ReplaySubject<Match[]>(1)

  get update$ () {
    return this.subject.asObservable()
  }

  constructor (private matchFactory: MatchFactory) {}

  run () {
    this.subscriptions[1] = this.matchFactory.events$.subscribe(event => {
      const { match } = event
      if (!match) {
        return
      }

      try {
        const command = new MatchCommand(match, event.type)
        this.scoreboard = command.execute(this.scoreboard)
        this.subject.next(this.scoreboard)
      } catch (error) {
        this.subject.error(error)
      }
    })
  }

  destroy () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }
}
