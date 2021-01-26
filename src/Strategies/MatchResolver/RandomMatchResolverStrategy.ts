import { Config } from '../../Entities/Config'
import { EventMatch, EventType } from '../../Entities/EventMatch'
import { Match } from '../../Entities/Match'
import { MatchResolverStrategy, ScheduledEvent } from './MatchResolverStrategy'

export class RandomMatchResolverStrategy implements MatchResolverStrategy {
  static numberActions = 5

  constructor (private config: Config) {}

  resolve (match: Match): ScheduledEvent[] {
    const events: ScheduledEvent[] = []
    const interval = this.config.matchDuration / (RandomMatchResolverStrategy.numberActions + 1)

    events.push(this.createStartEvent(match))
    events.push(this.createFinishEvent(match))

    Array.from({ length: RandomMatchResolverStrategy.numberActions }).forEach((_, i) => {
      const time = interval * (i + 1) * 1000 + match.startTime
      events.push({ time, event: this.createActionEvent(match) })
    })

    return events
  }

  private createStartEvent (match: Match): ScheduledEvent {
    const event = new EventMatch({ match, type: EventType.Start })
    return { time: match.startTime, event }
  }

  private createFinishEvent (match: Match): ScheduledEvent {
    const event = new EventMatch({ match, type: EventType.Finish })
    const eventTime = match.startTime + this.config.matchDuration * 1000
    return { time: eventTime, event }
  }

  private createActionEvent (match: Match): EventMatch {
    const types = [EventType.Empty, EventType.HomeGoal, EventType.AwayGoal]
    const type = types[Math.floor(Math.random() * types.length)]
    const event = new EventMatch({ match, type })
    return event
  }
}
