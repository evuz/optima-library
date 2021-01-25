import { ReplaySubject, Subscription } from 'rxjs'

import { Match } from '../Entities/Match'
import { MatchFactory } from '../Factories/Match/MatchFactory'
import { MatchCommand } from './MatchCommand/MatchCommand'

export class ScoreboardService {
  private matches = new Map<Match['id'], Match>()
  private scoreboard: Match[] = []

  private subscriptions: Subscription[] = []
  private subject = new ReplaySubject<Match[]>(1)

  get update$ () {
    return this.subject.asObservable()
  }

  constructor (private matchFactory: MatchFactory) {}

  run () {
    this.subscriptions[0] = this.matchFactory.matches$.subscribe(match => {
      this.matches.set(match.id, match)
    })

    this.subscriptions[1] = this.matchFactory.events$.subscribe(event => {
      const match = this.matches.get(event.match)
      if (!match) {
        return
      }

      const command = new MatchCommand(match, event.type)
      this.scoreboard = command.execute(this.scoreboard)
      this.subject.next(this.scoreboard)
    })
  }

  destroy () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }
}
