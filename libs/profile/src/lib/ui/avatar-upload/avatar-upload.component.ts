import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DndDirective, SvgIconComponent } from '@tt/common-ui'

@Component({
	selector: 'app-avatar-upload',
	standalone: true,
	imports: [SvgIconComponent, DndDirective, FormsModule],
	templateUrl: './avatar-upload.component.html',
	styleUrl: './avatar-upload.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarUploadComponent {
	preview = signal<string>('/assets/imgs/avatar-placeholder.png')

	avatar: File | null = null

	fileBrowserHandler(event: Event) {
		const file = (event.target as HTMLInputElement)?.files?.[0]
		this.processFile(file)
	}

	onFileDropped(file: File) {
		this.processFile(file)
	}

	processFile(file: File | null | undefined) {
		if (!file || !file.type.match('image')) return

		const reader = new FileReader()

		reader.onload = (event) => {
			this.preview.set(event.target?.result?.toString() ?? '')
		}

		reader.readAsDataURL(file)
		this.avatar = file
	}
}
