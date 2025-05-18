import {
	ChangeDetectionStrategy,
	Component,
	HostListener,
	inject
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { ModalService } from '../../data/services/modal.service'
import { SvgIconComponent } from '../svg-icon/svg-icon.component'

@Component({
	selector: 'tt-base-modal',
	standalone: true,
	imports: [CommonModule, SvgIconComponent],
	templateUrl: './modal-window.component.html',
	styleUrl: './modal-window.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalWindowComponent {
	modalService = inject(ModalService)

	closeModal() {
		this.modalService.close()
	}

	@HostListener('document:keydown.escape')
	onEsc(): void {
		this.closeModal()
	}
}
