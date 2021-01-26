import { Subject } from 'rxjs'

import { EventMatch, EventType } from '../../Entities/EventMatch'
import { Match, MatchState } from '../../Entities/Match'
import { Score } from '../../Entities/Score'
import { Team } from '../../Entities/Team'
import { MatchFactory } from '../../Factories/Match/MatchFactory'
import { MatchService } from '../MatchService'
import { FinishMatchService } from '../FinishMatchService'

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

describe('FinishMatchService', () => {
  let service: FinishMatchService
  let matchService: MatchService
  const subjects = {
    events: new Subject<EventMatch>()
  }
  const factory: MatchFactory = {
    events$: subjects.events.asObservable()
  }

  beforeEach(() => {
    matchService = new MatchService()
    service = new FinishMatchService(matchService, factory)
    service.run()
  })

  afterEach(() => {
    service.destroy()
  })

  test('should add match', () => {
    const match = createMatch('MEX', 'CHI')
    subjects.events.next({ type: EventType.Finish, match })

    expect(matchService.finished).toEqual([match])
  })

  test('should add the matches to the beginning of the array', () => {
    const firstMatch = createMatch('MEX', 'CHI')
    const secondMatch = createMatch('ESP', 'POR')

    subjects.events.next({ type: EventType.Finish, match: firstMatch })
    subjects.events.next({ type: EventType.Finish, match: secondMatch })

    expect(matchService.finished).toEqual([secondMatch, firstMatch])
  })
})
