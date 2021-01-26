import { filter, take } from 'rxjs/operators'

import { EventType } from '../../../Entities/EventMatch'
import { Match, MatchState } from '../../../Entities/Match'
import { Score } from '../../../Entities/Score'
import { Team } from '../../../Entities/Team'
import { MatchGeneratorStrategy } from '../../../Strategies/MatchGenerator/MatchGeneratorStrategy'
import { MatchResolverStrategy, ScheduledEvent } from '../../../Strategies/MatchResolver/MatchResolverStrategy'
import { DemoMatchFactory } from '../DemoMatchFactory'

let id = 0
function createMatch (home: Team, away: Team, startTime: number) {
  const matchId = id.toString()
  id++
  return new Match({
    home,
    away,
    startTime,
    score: new Score({ home: 0, away: 0 }),
    id: matchId,
    state: MatchState.Scheduled
  })
}

function createTeam (name) {
  return new Team({ code: name, name })
}

const generateMock = jest.fn()
function matchGenerator (): MatchGeneratorStrategy {
  let time

  function generate (teams: Team[]) {
    time = time ? time + 1000 : Date.now()
    const firstTime = time
    time = time + 1000
    const secondTime = time

    return [createMatch(teams[0], teams[1], firstTime), createMatch(teams[2], teams[3], secondTime)]
  }

  return {
    generate: generateMock.mockImplementation(generate)
  }
}

const resolveMock = jest.fn()
function matchResolve ():MatchResolverStrategy {
  function resolve (match: Match): ScheduledEvent[] {
    return [
      {
        time: match.startTime,
        event: { type: EventType.Start, match }
      },
      {
        time: match.startTime + 50,
        event: { type: EventType.AwayGoal, match }
      }
    ]
  }

  return {
    resolve: resolveMock.mockImplementation(resolve)
  }
}

describe('DemoMatchFactory', () => {
  let factory: DemoMatchFactory
  let teams: Team[]

  beforeEach(() => {
    jest.useFakeTimers()
    const generator = matchGenerator()
    const resolver = matchResolve()
    teams = [createTeam('ESP'), createTeam('FRA'), createTeam('ARG'), createTeam('BRA')]
    factory = new DemoMatchFactory(teams, generator, resolver)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('should start matches', done => {
    let i = 0
    factory.events$.pipe(filter(ev => ev.type === EventType.Start), take(2)).subscribe({
      next: ev => {
        const { match } = ev
        expect(match.home).toBe(teams[i * 2])
        expect(match.away).toBe(teams[i * 2 + 1])
        i++
      },
      complete: () => done()
    })

    jest.advanceTimersByTime(1000)
  })

  test('should fire all events', done => {
    factory.events$.pipe(take(4)).subscribe({
      complete: () => done()
    })

    jest.advanceTimersByTime(2000)
  })

  test('should get more matches', done => {
    factory.events$.pipe(filter(ev => ev.type === EventType.Start), take(3))
      .subscribe({
        complete: () => {
          done()
        }
      })
    jest.advanceTimersByTime(3000)
  })
})
