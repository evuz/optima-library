import { Match } from '../Entities/Match'

export function findMatch (match: Match, matches: Match[]) {
  if (!Array.isArray(matches)) {
    throw Error('matches must be an array')
  }

  if (!match || typeof match !== 'object') {
    throw Error('match must be an object')
  }

  return matches.find(m => m.id === match.id)
}
