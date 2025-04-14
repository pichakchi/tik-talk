import { createSelector } from '@ngrx/store'
import { communitiesFeature } from './reducer'

export const selectFilteredCommunities = createSelector(
	communitiesFeature.selectCommunities,
	(communities) => communities
)

export const selectCommunitiesPageable = createSelector(
	communitiesFeature.selectCommunitiesFeatureState,
	(state) => {
		return {
			page: state.page,
			size: state.size
		}
	}
)

export const selectCommunitiesFilters = createSelector(
	communitiesFeature.selectCommunitiesFilters,
	(filters) => filters
)
