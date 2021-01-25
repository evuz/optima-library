import { Team } from './Team'
import { Score } from './Score'
import { updateClass } from '../Utils/updateClass'

export enum MatchState {
  Scheduled,
  Live,
  Finish,
}

export class Match {
  id: string;
  home: Team;
  away: Team;
  score: Score;
  state: MatchState;
  startTime: number;

  constructor (match: Match) {
    updateClass<Match>(this, match)
  }
}
