import { updateClass } from '../Utils/updateClass'

export class Team {
  name: string
  code: string

  constructor (team: Team) {
    updateClass<Team>(this, team)
  }
}
