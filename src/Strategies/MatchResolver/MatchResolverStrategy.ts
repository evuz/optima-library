import { EventMatch } from '../../Entities/EventMatch'
import { Match } from '../../Entities/Match'

export type ScheduledEvent = {
  time: number
  event: EventMatch
}

export interface MatchResolverStrategy {
  resolve(match: Match): ScheduledEvent[]
}
