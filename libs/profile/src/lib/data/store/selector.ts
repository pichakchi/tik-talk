import { createSelector } from '@ngrx/store'
import { profileFeature } from './reducer'

export const selectFilteredProfiles = createSelector(
	profileFeature.selectProfiles,
	(profiles) => profiles
)

export const selectProfilePageable = createSelector(
	profileFeature.selectProfileFeatureState,
	(state) => {
		return {
			page: state.page,
			size: state.size
		}
	}
)

export const selectProfileFilters = createSelector(
	profileFeature.selectProfileFilters,
	(filters) => filters
)
