import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { ImgUrlPipe } from '@tt/common-ui'
import { Profile } from 'libs/data-access/src/lib/profile'

@Component({
	selector: 'app-profile-card',
	imports: [ImgUrlPipe],
	templateUrl: './profile-card.component.html',
	styleUrl: './profile-card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent {
	@Input() profile!: Profile
}
