import { take } from 'rxjs/operators'

import { EventType } from '../../../Entities/EventMatch'
import { Score } from '../../../Entities/Score'
import { Team } from '../../../Entities/Team'
import { ManualMatchFactory } from '../ManualMatchFactory'

describe('ManualMatchFactory', () => {
  let factory: ManualMatchFactory

  beforeEach(() => {
    factory = new ManualMatchFactory()
  })

  test('should start match', done => {
    const rma = new Team({ code: 'RMA', name: 'Real Madrid' })
    const fcb = new Team({ code: 'FCB', name: 'FC Barcelona' })

    factory.events$.subscribe(ev => {
      expect(ev.type).toEqual(EventType.Start)
      expect(ev.match.home).toBe(rma)
      expect(ev.match.away).toBe(fcb)
      done()
    })

    factory.start(rma, fcb)
  })

  test('should start match at 0-0', done => {
    const rma = new Team({ code: 'RMA', name: 'Real Madrid' })
    const fcb = new Team({ code: 'FCB', name: 'FC Barcelona' })

    factory.events$.subscribe(ev => {
      expect(ev.match.score).toEqual(new Score({ home: 0, away: 0 }))
      done()
    })

    factory.start(rma, fcb)
  })

  test('should finish match', async (done) => {
    const rma = new Team({ code: 'RMA', name: 'Real Madrid' })
    const fcb = new Team({ code: 'FCB', name: 'FC Barcelona' })

    const match = await factory.start(rma, fcb)

    factory.events$.subscribe(ev => {
      expect(ev.type).toEqual(EventType.Finish)
      expect(ev.match.home).toBe(rma)
      expect(ev.match.away).toBe(fcb)
      done()
    })

    factory.finish(match.id)
  })

  test('should throw an error when it finish a match not started', async () => {
    const rma = new Team({ code: 'RMA', name: 'Real Madrid' })
    const fcb = new Team({ code: 'FCB', name: 'FC Barcelona' })

    const match = await factory.start(rma, fcb)

    function error () {
      factory.finish(match.id.substr(1))
    }

    expect(error).toThrowError()
  })

  test('should fire events of goal', async (done) => {
    const rma = new Team({ code: 'RMA', name: 'Real Madrid' })
    const fcb = new Team({ code: 'FCB', name: 'FC Barcelona' })

    const match = await factory.start(rma, fcb)

    const types = []
    factory.events$.pipe(take(3)).subscribe({
      next: ev => {
        types.push(ev.type)
      },
      complete: () => {
        expect(types).toEqual([EventType.HomeGoal, EventType.HomeGoal, EventType.AwayGoal])
        done()
      }
    })

    factory.updateScore(match.id, [2, 1])
  })

  test('should update goal from current result', async (done) => {
    const rma = new Team({ code: 'RMA', name: 'Real Madrid' })
    const fcb = new Team({ code: 'FCB', name: 'FC Barcelona' })

    const match = await factory.start(rma, fcb)
    match.score.home = 2
    match.score.away = 3

    const types = []
    factory.events$.pipe(take(2)).subscribe({
      next: ev => {
        types.push(ev.type)
      },
      complete: () => {
        expect(types).toEqual([EventType.HomeGoal, EventType.AwayGoal])
        done()
      }
    })

    factory.updateScore(match.id, [3, 4])
  })

  test('should throw error if new result is lower than current', async () => {
    const rma = new Team({ code: 'RMA', name: 'Real Madrid' })
    const fcb = new Team({ code: 'FCB', name: 'FC Barcelona' })

    const match = await factory.start(rma, fcb)
    match.score.home = 3
    match.score.away = 1

    function error () {
      factory.updateScore(match.id, [1, 2])
    }

    expect(error).toThrowError(/lower/)
  })
})
