import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { AvatarCircleComponent } from '@tt/common-ui'
import { Profile } from 'libs/data-access/src/lib/profile'

@Component({
	selector: 'app-profile-header',
	imports: [AvatarCircleComponent],
	templateUrl: './profile-header.component.html',
	styleUrl: './profile-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileHeaderComponent {
	profile = input<Profile>()
}
