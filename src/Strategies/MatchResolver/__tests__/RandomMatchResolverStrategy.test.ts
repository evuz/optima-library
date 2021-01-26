import { Config } from '../../../Entities/Config'
import { EventType } from '../../../Entities/EventMatch'
import { Match, MatchState } from '../../../Entities/Match'
import { Score } from '../../../Entities/Score'
import { Team } from '../../../Entities/Team'
import { RandomMatchResolverStrategy } from '../RandomMatchResolverStrategy'

let id = 0
function createMatch (home: string, away: string, date = new Date()) {
  const matchId = id.toString()
  id++
  return new Match({
    home: new Team({ code: home, name: home }),
    away: new Team({ code: away, name: away }),
    score: new Score({ home: 0, away: 0 }),
    id: matchId,
    startTime: date.getTime(),
    state: MatchState.Scheduled
  })
}

describe('RandomMatchResolverStrategy', () => {
  let strategy: RandomMatchResolverStrategy
  const config: Config = {
    matchDuration: 60,
    resultsPageSize: null
  }

  beforeEach(() => {
    strategy = new RandomMatchResolverStrategy(config)
  })

  test('should generate start event', () => {
    const match = createMatch('SEV', 'BET')
    const events = strategy.resolve(match)
    const startEvent = events.find(ev => ev.event.type === EventType.Start)

    expect(startEvent).toBeTruthy()
  })

  test('should generate finish event', () => {
    const match = createMatch('SEV', 'BET')
    const events = strategy.resolve(match)
    const startEvent = events.find(ev => ev.event.type === EventType.Finish)

    expect(startEvent).toBeTruthy()
    expect(startEvent.time).toEqual(match.startTime + config.matchDuration * 1000)
  })

  test('should generate 5 actions', () => {
    const actionTypes = [EventType.Empty, EventType.HomeGoal, EventType.AwayGoal]
    const match = createMatch('SEV', 'BET')
    const events = strategy.resolve(match)
    const actions = events.filter(ev => actionTypes.includes(ev.event.type))
    expect(actions.length).toEqual(5)
  })

  test('should generate correct interval time', () => {
    const date = new Date(2020, 1, 20, 10, 20, 30, 0)
    const match = createMatch('SEV', 'BET', date)
    const events = strategy.resolve(match)

    events.sort((a, b) => a.time - b.time)
    const interval = 10 * 1000

    expect(events[6].time - events[5].time).toEqual(interval)
    expect(events[5].time - events[4].time).toEqual(interval)
    expect(events[4].time - events[3].time).toEqual(interval)
    expect(events[3].time - events[2].time).toEqual(interval)
    expect(events[2].time - events[1].time).toEqual(interval)
    expect(events[1].time - events[0].time).toEqual(interval)
  })
})
