import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	inject,
	ViewChild,
	ViewContainerRef
} from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { SidebarComponent } from '../sidebar/sidebar.component'
import { ModalService } from '@tt/common-ui'
import { ModalHostComponent } from '../modal-host/modal-host.component'

@Component({
	selector: 'app-layout',
	standalone: true,
	imports: [RouterOutlet, SidebarComponent, ModalHostComponent],
	templateUrl: './layout.component.html',
	styleUrl: './layout.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements AfterViewInit {
	modalService = inject(ModalService)

	@ViewChild('modalContainer', { read: ViewContainerRef, static: true })
	modalContainer!: ViewContainerRef

	ngAfterViewInit() {
		this.modalService.setContainer(this.modalContainer)
	}
}
