import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostBinding,
	inject,
	input,
	Output,
	Renderer2
} from '@angular/core'
import { NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { firstValueFrom } from 'rxjs'
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui'
import { GlobalStoreService } from '@tt/data-access'
import { PostService } from '../../data'

@Component({
	selector: 'app-post-input',
	standalone: true,
	imports: [AvatarCircleComponent, NgIf, SvgIconComponent, FormsModule],
	templateUrl: './post-input.component.html',
	styleUrl: './post-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostInputComponent {
	r2 = inject(Renderer2)
	postService = inject(PostService)

	isCommentInput = input(false)
	postId = input<number>(0)
	profile = inject(GlobalStoreService).meProfile

	@Output() created = new EventEmitter()

	@HostBinding('class.comment')
	get isComment() {
		return this.isCommentInput()
	}

	postText = ' '

	onTextAreaInput(event: Event) {
		const textarea = event.target as HTMLTextAreaElement

		this.r2.setStyle(textarea, 'height', 'auto')
		this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px')
	}

	onCreatePost() {
		if (!this.postText) return

		if (this.isCommentInput()) {
			firstValueFrom(
				this.postService.createComment({
					text: this.postText,
					authorId: this.profile()!.id,
					postId: this.postId()
				})
			).then(() => {
				this.postText = ''
				this.created.emit()
			})
			return
		}

		firstValueFrom(
			this.postService.createPost({
				title: 'Пост',
				content: this.postText,
				authorId: this.profile()!.id
			})
		).then(() => {
			this.postText = ''
		})
	}
}
