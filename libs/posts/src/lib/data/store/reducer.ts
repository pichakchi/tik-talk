import { Post } from '../interfaces/post.interface'
import { createFeature, createReducer, on } from '@ngrx/store'
import { postActions } from './action'

export interface PostState {
	posts: Post[]
	comments: Comment[]
}

export const initialState: PostState = {
	posts: [],
	comments: []
}

export const postFeature = createFeature({
	name: 'postFeature',
	reducer: createReducer(
		initialState,

		// on(postActions.createPost, (state, { post }) => ({
		// 	...state,
		// 	posts: [...state.posts, post]
		// })),

		on(postActions.loadedPost, (state, { posts }) => ({
			...state,
			posts
		})),

		on(postActions.loadedComment, (state, { comment }) => ({
			...state,
			comment
		}))
	)
})
