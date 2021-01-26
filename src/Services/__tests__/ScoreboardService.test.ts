import { Subject } from 'rxjs'
import { skip } from 'rxjs/operators'

import { EventMatch, EventType } from '../../Entities/EventMatch'
import { Match, MatchState } from '../../Entities/Match'
import { Score } from '../../Entities/Score'
import { Team } from '../../Entities/Team'
import { MatchFactory } from '../../Factories/Match/MatchFactory'
import { ScoreboardService } from '../ScoreBoardService'

let id = 0
function createMatch (home: string, away: string) {
  const matchId = id.toString()
  id++
  return new Match({
    home: new Team({ code: home, name: home }),
    away: new Team({ code: away, name: away }),
    score: new Score({ home: 0, away: 0 }),
    id: matchId,
    startTime: Date.now() + 1000,
    state: MatchState.Scheduled
  })
}

describe('ScoreboardService', () => {
  let service: ScoreboardService

  const subjects = {
    events: new Subject<EventMatch>()
  }
  const factory: MatchFactory = {
    events$: subjects.events.asObservable()
  }

  beforeEach(() => {
    service = new ScoreboardService(factory)
    service.run()
  })

  afterEach(() => {
    service.destroy()
  })

  test('should fire when match start', (done) => {
    const match = createMatch('RMA', 'FCB')

    service.update$.subscribe((matches) => {
      const m = matches[0]
      expect(m).toBe(match)
      expect(m.state).toEqual(MatchState.Live)
      done()
    })

    subjects.events.next({ match: match, type: EventType.Start })
  })

  test('should save all matches', (done) => {
    const firstMatch = createMatch('RMA', 'FCB')
    const secondMatch = createMatch('SEV', 'BET')

    service.update$.pipe(skip(1)).subscribe((matches) => {
      expect(matches.length).toEqual(2)
      expect(matches[0]).toBe(firstMatch)
      expect(matches[1]).toEqual(secondMatch)
      done()
    })

    subjects.events.next({ match: firstMatch, type: EventType.Start })
    subjects.events.next({ match: secondMatch, type: EventType.Start })
  })

  test('should keep score when it is not empty', (done) => {
    const match = createMatch('RMA', 'FCB')
    match.score = new Score({ home: 1, away: 2 })

    service.update$.subscribe((matches) => {
      const m = matches[0]
      expect(m.score.home).toEqual(1)
      expect(m.score.away).toEqual(2)
      done()
    })

    subjects.events.next({ match: match, type: EventType.Start })
  })

  test('should init score at 0-0 when it is empty', (done) => {
    const match = createMatch('RMA', 'FCB')
    match.score = null

    service.update$.subscribe((matches) => {
      const m = matches[0]
      expect(m.score.home).toEqual(0)
      expect(m.score.away).toEqual(0)
      done()
    })

    subjects.events.next({ match: match, type: EventType.Start })
  })

  test('should update home score', (done) => {
    const match = createMatch('RMA', 'FCB')

    expect(match.score.home).toEqual(0)

    service.update$.subscribe(() => {
      expect(match.score.home).toEqual(1)
      expect(match.score.away).toEqual(0)
      done()
    })

    subjects.events.next({ match: match, type: EventType.HomeGoal })
  })

  test('should update away score', (done) => {
    const match = createMatch('RMA', 'FCB')

    expect(match.score.home).toEqual(0)

    service.update$.subscribe(() => {
      expect(match.score.home).toEqual(0)
      expect(match.score.away).toEqual(1)
      done()
    })

    subjects.events.next({ match: match, type: EventType.AwayGoal })
  })

  test('should remove finish match', (done) => {
    const match = createMatch('RMA', 'FCB')

    expect(match.score.home).toEqual(0)

    service.update$.subscribe((matches) => {
      expect(matches.length).toEqual(0)
      done()
    })

    subjects.events.next({ match: match, type: EventType.Finish })
  })

  test('should ignore event when match is empty', (done) => {
    const match = createMatch('RMA', 'FCB')

    expect(match.score.home).toEqual(0)

    service.update$.subscribe((matches) => {
      expect(matches.length).toEqual(1)
      expect(matches[0]).toBe(match)
      done()
    })

    subjects.events.next({ match: null, type: EventType.Start })
    subjects.events.next({ match: match, type: EventType.Start })
  })

  test('should add event even if it has not been started', (done) => {
    const match = createMatch('RMA', 'FCB')

    service.update$.subscribe((matches) => {
      expect(matches.length).toEqual(1)
      expect(matches[0]).toBe(match)
      done()
    })

    subjects.events.next({ match: match, type: EventType.AwayGoal })
  })

  test('should throw error if event has been started twice', (done) => {
    const match = createMatch('RMA', 'FCB')

    service.update$.subscribe({
      error: (error) => {
        expect(new RegExp(match.id).exec(error)).toBeTruthy()
        done()
      }
    })

    subjects.events.next({ match: match, type: EventType.Start })
    subjects.events.next({ match: match, type: EventType.Start })
  })
})
