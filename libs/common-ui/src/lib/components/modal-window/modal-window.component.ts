import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core'
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

	closeWindow() {
		this.isVisible = false
	}
}
