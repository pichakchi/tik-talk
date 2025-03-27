import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	inject,
	Output,
	Renderer2
} from '@angular/core'
import { NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui'
import { ProfileService } from '@tt/data-access'

@Component({
	selector: 'app-message-input',
	standalone: true,
	imports: [AvatarCircleComponent, FormsModule, SvgIconComponent, NgIf],
	templateUrl: './message-input.component.html',
	styleUrl: './message-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageInputComponent {
	r2 = inject(Renderer2)
	me = inject(ProfileService).me

	@Output() created = new EventEmitter<string>()

	postText = ' '

	onTextAreaInput(event: Event) {
		const textarea = event.target as HTMLTextAreaElement

		this.r2.setStyle(textarea, 'height', 'auto')
		this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px')
	}

	onCreatePost() {
		if (!this.postText) return

		this.created.emit(this.postText)
		this.postText = ''
	}
}
