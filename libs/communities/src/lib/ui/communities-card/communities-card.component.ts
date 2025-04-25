import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input
} from '@angular/core'
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui'
import { CommunitiesService, Community } from '@tt/data-access'
import { NgClass } from '@angular/common'

@Component({
	selector: 'app-communities-card',
	imports: [ImgUrlPipe, SvgIconComponent, NgClass],
	templateUrl: './communities-card.component.html',
	styleUrl: './communities-card.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitiesCardComponent {
	community = input.required<Community>()
	communityService = inject(CommunitiesService)

	isMyCommunity = computed(() => {
		return this.community().admin.id === this.communityService.me()?.id
	})

	onSubscribe(community_id: any) {
		if (this.communityService.isSubscribed) {
			this.communityService.leaveCommunity(community_id)
		} else {
			this.communityService.joinCommunity(community_id)
		}
	}
}
