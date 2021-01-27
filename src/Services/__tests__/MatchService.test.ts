import { Match, MatchState } from '../../Entities/Match'
import { Score } from '../../Entities/Score'
import { Team } from '../../Entities/Team'
import { MatchService } from '../MatchService'

let id = 0
function createMatch (homeScore: number, awayScore: number, startTime: number) {
  const matchId = id.toString()
  id++
  return new Match({
    home: new Team({ code: 'RMA', name: 'RMA' }),
    away: new Team({ code: 'FCB', name: 'FCB' }),
    score: new Score({ home: homeScore, away: awayScore }),
    startTime,
    id: matchId,
    state: MatchState.Scheduled
  })
}

describe('MatchService', () => {
  let service: MatchService

  beforeEach(() => {
    service = new MatchService()
  })

  test('should sort match by score', () => {
    const date = new Date(2020, 0, 10, 10, 30, 0, 0)
    const m1 = createMatch(0, 4, date.getTime())
    date.setMinutes(date.getMinutes() + 2)
    const m2 = createMatch(2, 3, date.getTime())
    date.setMinutes(date.getMinutes() + 2)
    const m3 = createMatch(0, 2, date.getTime())
    service.addFinished(m1)
    service.addFinished(m2)
    service.addFinished(m3)

    expect(service.finished).toEqual([m2, m1, m3])
  })

  test('should sort match by time if it has the same score', () => {
    const date = new Date(2020, 0, 10, 10, 30, 0, 0)
    const m1 = createMatch(0, 4, date.getTime())

    date.setMinutes(date.getMinutes() + 2)
    const m2 = createMatch(2, 3, date.getTime())

    date.setMinutes(date.getMinutes() + 2)
    const m3 = createMatch(0, 4, date.getTime())

    date.setMinutes(date.getMinutes() - 10)
    const m4 = createMatch(0, 4, date.getTime())

    service.addFinished(m1)
    service.addFinished(m2)
    service.addFinished(m3)
    service.addFinished(m4)

    expect(service.finished).toEqual([m2, m4, m1, m3])
  })
})
