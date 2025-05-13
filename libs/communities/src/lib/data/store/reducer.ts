import { Community } from '@tt/data-access'
import { createFeature, createReducer, on } from '@ngrx/store'
import { communitiesActions } from './actions'

export interface CommunitiesState {
	communities: Community[]
	communitiesFilters: Record<string, any>
	page: number
	size: number
}

export const initialState: CommunitiesState = {
	communities: [],
	communitiesFilters: {},
	page: 1,
	size: 10
}

export const communitiesFeature = createFeature({
	name: 'communitiesFeature',
	reducer: createReducer(
		initialState,
		on(communitiesActions.communitiesLoaded, (state, payload) => {
			return {
				...state,
				communities: state.communities.concat(payload.communities)
			}
		}),
		on(communitiesActions.filterCommunities, (state, payload) => {
			return {
				...state,
				communities: [],
				communitiesFilters: payload.filters,
				page: 1
			}
		}),
		on(communitiesActions.setPage, (state, payload) => {
			let page = payload.page

			if (!page) page = state.page + 1

			return {
				...state,
				page
			}
		})
	)
})
