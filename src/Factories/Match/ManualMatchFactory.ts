import { Observable, Subject } from 'rxjs'
import { EventMatch, EventType } from '../../Entities/EventMatch'
import { Match, MatchState } from '../../Entities/Match'
import { Score } from '../../Entities/Score'
import { Team } from '../../Entities/Team'
import { uuid } from '../../Utils/uuid'
import { MatchFactory } from './MatchFactory'

export class ManualMatchFactory implements MatchFactory {
  private matches = new Map<Match['id'], Match>()
  private _subject: Subject<EventMatch>

  events$: Observable<EventMatch>

  constructor () {
    this._subject = new Subject<EventMatch>()
    this.events$ = this._subject.asObservable()
  }

  start (home: Team, away: Team) {
    const match = new Match({
      id: uuid(),
      home,
      away,
      score: new Score({ home: 0, away: 0 }),
      startTime: Date.now(),
      state: MatchState.Live
    })

    this.matches.set(match.id, match)
    this._subject.next({ type: EventType.Start, match })

    return Promise.resolve(match)
  }

  finish (matchId: Match['id']) {
    if (!this.matches.has(matchId)) {
      throw new Error('You must start match before finishing it')
    }

    const match = this.matches.get(matchId)
    this._subject.next({ type: EventType.Finish, match })
    this.matches.delete(matchId)

    return Promise.resolve(match)
  }

  updateScore (matchId: Match['id'], score: [number, number]) {
    if (!this.matches.has(matchId)) {
      throw new Error('You must start match before finishing it')
    }

    const match = this.matches.get(matchId)
    const [home, away] = score
    const homeDiff = home - match.score.home
    const awayDiff = away - match.score.away

    if (homeDiff < 0 || awayDiff < 0) {
      throw new Error('The new result cannot be lower than the current one')
    }

    const goalHomeEvents = this.generateGoalEvent(homeDiff, EventType.HomeGoal)
    const goalAwayEvents = this.generateGoalEvent(awayDiff, EventType.AwayGoal)
    const goalEvents = goalHomeEvents.concat(goalAwayEvents)

    goalEvents.forEach((type) => {
      this._subject.next({ type, match })
    })

    return Promise.resolve(match)
  }

  private generateGoalEvent (n: number, type: EventType) {
    return Array.from({ length: n }).map(() => type)
  }
}
