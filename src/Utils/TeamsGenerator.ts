import { Team } from '../Entities/Team'

export function spainTeams () {
  return [
    new Team({ name: 'Atlético de Madrid', code: 'ATM' }),
    new Team({ name: 'Real Madrid', code: 'ATM' }),
    new Team({ name: 'FC Barcelona', code: 'FCB' }),
    new Team({ name: 'Sevilla', code: 'SEV' }),
    new Team({ name: 'Villareal', code: 'VIL' }),
    new Team({ name: 'Real Sociedad', code: 'RSO' }),
    new Team({ name: 'Granada', code: 'GRA' }),
    new Team({ name: 'Real Betis', code: 'BET' }),
    new Team({ name: 'Athletic Bilbao', code: 'ATH' }),
    new Team({ name: 'Cádiz', code: 'CAD' })
  ]
}
