import { inject, Injectable } from '@angular/core'
import { CommunitiesService } from '@tt/data-access'

import { Store } from '@ngrx/store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { communitiesActions } from './actions'
import { map, switchMap, withLatestFrom } from 'rxjs'
import { selectCommunitiesFilters, selectCommunitiesPageable } from './selector'

@Injectable({
	providedIn: 'root'
})
export class CommunitiesEffects {
	communitiesService = inject(CommunitiesService)
	actions$ = inject(Actions)
	store = inject(Store)

	filterCommunities = createEffect(() => {
		return this.actions$.pipe(
			ofType(communitiesActions.filterEvents, communitiesActions.setPage),
			withLatestFrom(
				this.store.select(selectCommunitiesFilters),
				this.store.select(selectCommunitiesPageable)
			),
			switchMap(([_, filters, pageable]) => {
				return this.communitiesService.filterCommunities({
					...pageable,
					...filters
				})
			}),
			map((res) =>
				communitiesActions.communitiesLoaded({ communities: res.items })
			)
		)
	})
}
