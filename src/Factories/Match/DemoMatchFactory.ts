import { Observable, Subject } from 'rxjs'
import { EventMatch, EventType } from '../../Entities/EventMatch'
import { Match } from '../../Entities/Match'
import { Team } from '../../Entities/Team'
import { MatchGeneratorStrategy } from '../../Strategies/MatchGenerator/MatchGeneratorStrategy'
import { MatchResolverStrategy, ScheduledEvent } from '../../Strategies/MatchResolver/MatchResolverStrategy'
import { MatchFactory } from './MatchFactory'

export class DemoMatchFactory implements MatchFactory {
  private matches = new Map<Match['id'], Match>()
  private lastMatch: Match;
  private _subject: Subject<EventMatch>

  events$: Observable<EventMatch>

  constructor (
    private teams: Team[],
    private matchGenerator: MatchGeneratorStrategy,
    private matchResolver: MatchResolverStrategy
  ) {
    this._subject = new Subject<EventMatch>()
    this.events$ = this._subject.asObservable()

    this.run()
  }

  private run () {
    const matches = this.matchGenerator.generate(this.teams)
    this.lastMatch = matches[matches.length - 1]
    matches.forEach(match => {
      this.matches.set(match.id, match)
      const events = this.matchResolver.resolve(match)
      this.scheduleEvents(events)
    })
  }

  private scheduleEvents (events: ScheduledEvent[]) {
    events.forEach(event => {
      const delay = event.time - Date.now()
      setTimeout(() => {
        this._subject.next(event.event)
        this.generateMatches(event.event)
      }, delay)
    })
  }

  private generateMatches (event: EventMatch) {
    if (event.type === EventType.Start && event.match === this.lastMatch) {
      this.run()
    }
  }
}
