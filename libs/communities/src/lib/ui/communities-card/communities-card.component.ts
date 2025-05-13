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
import { firstValueFrom } from 'rxjs'

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

	isSubscribed: boolean | null = null
	buttonText: string | null = null

	ngOnInit() {
		if (this.community) {
			this.isSubscribed = this.community().isJoined
			this.buttonText = this.isSubscribed ? 'Отписаться' : 'Подписаться'
		}
	}

	isMyCommunity = computed(() => {
		return this.community().admin.id === this.communityService.me()?.id
	})

	async onSubscribe(community_id: any) {
		this.isSubscribed = !this.isSubscribed
		this.buttonText = this.isSubscribed ? 'Отписаться' : 'Подписаться'
		try {
			if (this.isSubscribed) {
				await firstValueFrom(this.communityService.leaveCommunity(community_id))
				this.isSubscribed = false
				this.buttonText = 'Отписаться'
			} else {
				await firstValueFrom(this.communityService.joinCommunity(community_id))
				this.isSubscribed = true
				this.buttonText = 'Подписаться'
			}
		} catch (error) {
			console.error(error)
		}
	}
}
