import { Match, MatchState } from '../../Entities/Match'
import { Score } from '../../Entities/Score'
import { Team } from '../../Entities/Team'
import { findMatch } from '../findMatch'

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

describe('findMatch', () => {
  const matches = [
    createMatch('SEV', 'BET'),
    createMatch('RMA', 'VIL'),
    createMatch('FCB', 'VAL'),
    createMatch('ATM', 'ATH')
  ]

  test('should return correct match', () => {
    const match = findMatch(matches[2], matches)

    expect(match).toBe(matches[2])
  })

  test('should throw error if matches is not a array', () => {
    function error () {
      findMatch(matches[2], <any>{})
    }

    expect(error).toThrowError()
  })

  test('should throw error if match is not an object', () => {
    function error () {
      findMatch(null, matches)
    }

    expect(error).toThrowError(/be an object/)
  })
})
