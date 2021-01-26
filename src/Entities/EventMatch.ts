import { Match } from './Match'
import { updateClass } from '../Utils/updateClass'

export enum EventType {
  AwayGoal,
  HomeGoal,
  Empty,
  Finish,
  Start
}

export class EventMatch {
  match: Match
  type: EventType

  constructor (event: EventMatch) {
    updateClass<EventMatch>(this, event)
  }
}
