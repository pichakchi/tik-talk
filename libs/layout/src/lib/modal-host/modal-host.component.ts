import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ViewChild,
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
export class ModalHostComponent implements AfterViewInit {
	@ViewChild('modalContainer', { read: ViewContainerRef })
	modalContainer!: ViewContainerRef

	constructor(private modalService: ModalService) {}

	ngAfterViewInit() {
		this.modalService.setContainer(this.modalContainer)
	}
}
