import { Match } from './Match'

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
}
