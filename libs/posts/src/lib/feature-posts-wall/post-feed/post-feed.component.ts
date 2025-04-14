import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	Renderer2
} from '@angular/core'
import { debounceTime, firstValueFrom, fromEvent } from 'rxjs'
import { PostInputComponent } from '../../ui'
import { Store } from '@ngrx/store'
import { GlobalStoreService } from '@tt/data-access'
import { PostComponent } from '../post/post.component'
import { PostService } from '../../data/services/post.service'
import { selectCreatedPosts } from '../../data/store/selector'
import { postActions } from '../../data/store/action'

@Component({
	selector: 'app-post-feed',
	standalone: true,
	imports: [PostInputComponent, PostComponent],
	templateUrl: './post-feed.component.html',
	styleUrl: './post-feed.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostFeedComponent {
	postService = inject(PostService)
	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)
	store = inject(Store)

	profile = inject(GlobalStoreService).meProfile
	feed = this.store.selectSignal(selectCreatedPosts)

	ngOnInit() {
		this.store.dispatch(postActions.fetchPosts({}))
	}

	ngAfterViewInit() {
		this.resizeFeed()

		fromEvent(window, 'resize')
			.pipe(debounceTime(200))
			.subscribe(() => {
				this.resizeFeed()
			})
	}

	resizeFeed() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect()
		const height = window.innerHeight - top - 24 - 24
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}

	onCreatePost(postText: string) {
		if (!postText) return

		this.store.dispatch(
			postActions.createPost({
				payload: {
					title: 'Вау',
					content: postText,
					authorId: this.profile()!.id
				}
			})
		)

		firstValueFrom(
			this.postService.createPost({
				title: 'Вау',
				content: postText,
				authorId: this.profile()!.id
			})
		).then(() => {})
	}
}
