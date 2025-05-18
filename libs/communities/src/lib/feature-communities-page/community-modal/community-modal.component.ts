import { Component } from '@angular/core'
import { ModalWindowComponent } from '../../../../../common-ui/src/lib/components/modal-window/modal-window.component'

@Component({
	selector: 'tt-community-modal',
	standalone: true,
	templateUrl: './community-modal.component.html',
	imports: [ModalWindowComponent],
	styleUrl: './community-modal.component.scss'
})
export class CommunityModalComponent {}
