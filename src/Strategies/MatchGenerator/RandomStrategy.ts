import { Config } from '../../Entities/Config'
import { Match, MatchState } from '../../Entities/Match'
import { Score } from '../../Entities/Score'
import { Team } from '../../Entities/Team'
import { uuid } from '../../Utils/uuid'
import { MatchGeneratorStrategy } from './MatchGeneratorStrategy'

export class RandomMathGeneratorStrategy implements MatchGeneratorStrategy {
  private lastMatchTime: Date

  constructor (private config: Config) {}

  generate (teams: Team[]) {
    const matches: Match[] = []
    teams = this.shuffle(teams)

    while (teams.length > 1) {
      this.updateStarTime()
      matches.push(this.createMatch(teams.shift(), teams.shift(), this.lastMatchTime.getTime()))
    }

    return matches
  }

  private updateStarTime () {
    if (!this.lastMatchTime) {
      this.lastMatchTime = new Date()
      this.lastMatchTime.setMinutes(this.lastMatchTime.getMinutes() + 1, 0, 0)
      return
    }

    const { timeBetweenMatches } = this.config.demo

    this.lastMatchTime.setSeconds(this.lastMatchTime.getSeconds() + timeBetweenMatches)
  }

  private shuffle (teams: Team[]) {
    teams = teams.slice()
    for (let i = teams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [teams[i], teams[j]] = [teams[j], teams[i]]
    }
    return teams
  }

  private createMatch (home: Team, away: Team, startTime: number) {
    return new Match({
      id: uuid(),
      home,
      away,
      startTime,
      score: new Score({ home: 0, away: 0 }),
      state: MatchState.Scheduled
    })
  }
}
