import { updateClass } from '../Utils/updateClass'

export class Score {
  home: number
  away: number

  constructor (score: Score) {
    updateClass<Score>(this, score)
  }
}
