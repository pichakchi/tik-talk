import { createSelector } from '@ngrx/store'
import { postFeature } from './reducer'

export const selectCreatedPosts = createSelector(
	postFeature.selectPosts,
	(posts) => posts
)
