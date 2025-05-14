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
import { GlobalStoreService } from '@tt/data-access'
import { Post, postActions, PostComment } from '@tt/posts'

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
export class PostComponent {
	post = input<Post>()
	profile = inject(GlobalStoreService).meProfile
	comments = signal<PostComment[]>([])

	store = inject(Store)

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
}
