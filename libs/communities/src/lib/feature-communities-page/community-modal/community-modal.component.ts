import { Component } from '@angular/core'
import { ModalWindowComponent } from '@tt/common-ui'

@Component({
	selector: 'tt-community-modal',
	standalone: true,
	templateUrl: './community-modal.component.html',
	imports: [ModalWindowComponent],
	styleUrl: './community-modal.component.scss'
})
export class CommunityModalComponent {}
