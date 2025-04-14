import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	OnInit,
	signal
} from '@angular/core'
import { CommentComponent, PostInputComponent } from '../../ui'

import {
	AvatarCircleComponent,
	SvgIconComponent,
	TimeAgoPipe
} from '@tt/common-ui'
import { Store } from '@ngrx/store'
import { Post, postActions, PostComment } from '@tt/posts'
import { GlobalStoreService } from '@tt/data-access'

@Component({
	selector: 'app-post',
	standalone: true,
	imports: [
		AvatarCircleComponent,
		SvgIconComponent,
		PostInputComponent,
		CommentComponent,
		TimeAgoPipe
	],
	templateUrl: './post.component.html',
	styleUrl: './post.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {
	post = input<Post>()
	profile = inject(GlobalStoreService).meProfile
	comments = signal<PostComment[]>([])

	store = inject(Store)

	ngOnInit() {
		this.store.dispatch(postActions.fetchPosts({}))
		this.store.dispatch(postActions.fetchComments({ postId: this.post()!.id }))
	}

	onCreated(commentText: string) {
		if (!commentText) return

		this.store.dispatch(
			postActions.createComment({
				payload: {
					text: commentText,
					authorId: this.profile()!.id,
					postId: this.post()!.id
				}
			})
		)
	}

	// async ngOnInit() {
	// 	this.comments.set(this.post()!.comments)
	// }
	//
	// async onCreated() {
	// 	const comments = await firstValueFrom(
	// 		this.postService.getCommentsByPostId(this.post()!.id)
	// 	)
	// 	//@ts-ignore
	// 	this.comments.set(comments)
	// }
}
