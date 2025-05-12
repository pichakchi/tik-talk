import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
	TemplateRef
} from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
	selector: 'tt-modal-window',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './modal-window.component.html',
	styleUrl: './modal-window.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalWindowComponent {
	@Input() isVisible: boolean = false
	@Input() content!: TemplateRef<any>
	@Output() close = new EventEmitter<void>()

	closeWindow() {
		this.close.emit()
	}
}
