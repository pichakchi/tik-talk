import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { postActions } from './action'
import { map, switchMap } from 'rxjs'
import { PostService } from '../services/post.service'

@Injectable({
	providedIn: 'root'
})
export class PostEffects {
	actions$ = inject(Actions)
	postService = inject(PostService)

	createPosts = createEffect(() => {
		return this.actions$.pipe(
			ofType(postActions.createPost),
			switchMap(({ payload }) => {
				return this.postService
					.createPost({
						title: payload.title,
						content: payload.content,
						authorId: payload.authorId
					})
					.pipe(map(() => postActions.fetchPosts({})))
			})
		)
	})

	loadedPosts = createEffect(() => {
		return this.actions$.pipe(
			ofType(postActions.fetchPosts),
			switchMap(() =>
				this.postService
					.fetchPosts()
					.pipe(map((posts) => postActions.loadedPost({ posts })))
			)
		)
	})

	createComments = createEffect(() => {
		return this.actions$.pipe(
			ofType(postActions.createComment),
			switchMap(({ payload }) => {
				return this.postService
					.createComment({
						text: payload.text,
						authorId: payload.authorId,
						postId: payload.postId
					})
					.pipe(map(() => postActions.fetchPosts({})))
			})
		)
	})

	loadedComments = createEffect(() => {
		return this.actions$.pipe(
			ofType(postActions.fetchComments),
			switchMap(({ postId }) =>
				this.postService
					.getCommentsByPostId(postId)
					.pipe(
						map((comments) => postActions.loadedComment({ comment: comments }))
					)
			)
		)
	})
}
