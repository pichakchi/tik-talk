import {
	ChangeDetectionStrategy,
	Component,
	ViewChild,
	viewChild,
	ViewContainerRef
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { ModalService } from '@tt/common-ui'

@Component({
	selector: 'app-modal-host',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './modal-host.component.html',
	styleUrl: './modal-host.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalHostComponent {
	@ViewChild('modalContainer', { read: ViewContainerRef, static: true })
	modalContainer!: ViewContainerRef

	constructor(public modalService: ModalService) {
		this.modalService.setContainer(this.modalContainer)
	}
}
