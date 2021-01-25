import { Observable } from 'rxjs'

import { EventMatch } from '../../Entities/EventMatch'
import { Match } from '../../Entities/Match'

export interface MatchFactory {
  events$: Observable<EventMatch>
  matches$: Observable<Match>
}
