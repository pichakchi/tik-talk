import { createActionGroup, props } from '@ngrx/store'
import {
	CommentCreateDto,
	Post,
	PostComment,
	PostCreateDto
} from '../interfaces/post.interface'

export const postActions = createActionGroup({
	source: 'post',
	events: {
		'loaded post': props<{ posts: Post[] }>(),
		'create post': props<{ payload: PostCreateDto }>(),
		'fetch posts': props<{ page?: number }>(),

		'loaded comment': props<{ comment: PostComment[] }>(),
		'create comment': props<{ payload: CommentCreateDto }>(),
		'fetch comments': props<{ postId: number }>()
	}
})
