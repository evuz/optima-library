import { Match } from '../../Entities/Match'
import { Team } from '../../Entities/Team'

export interface MatchGeneratorStrategy {
    generate(teams: Team[]): Match[]
}
