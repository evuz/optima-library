import { Observable } from 'rxjs'

import { EventMatch } from '../../Entities/EventMatch'

export interface MatchFactory {
  events$: Observable<EventMatch>
}
