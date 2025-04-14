import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Input,
	signal
} from '@angular/core'
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui'
import { Communities, CommunitiesService } from '@tt/data-access'
import { AsyncPipe, NgClass, NgIf } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'
import { switchMap } from 'rxjs'
import { toObservable } from '@angular/core/rxjs-interop'

@Component({
	selector: 'app-communities-card',
	imports: [ImgUrlPipe, SvgIconComponent, NgClass, AsyncPipe],
	templateUrl: './communities-card.component.html',
	styleUrl: './communities-card.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitiesCardComponent {
	@Input() communities!: Communities
	http = inject(HttpClient)
	communityService = inject(CommunitiesService)
	route = inject(ActivatedRoute)

	baseApiUrl = 'https://icherniakov.ru/yt-course/'
	isSubscribed: boolean = false
	buttonText: string = 'Подписаться'
	// iconName: string = 'public/assets/svg/subscribe.svg'

	me$ = toObservable(this.communityService.me)

	isMyCommunity = signal(false)

	community$ = this.route.params.pipe(
		switchMap(({ id }) => {
			this.isMyCommunity.set(
				id === 'me' || id === this.communityService.me()?.id
			)
			if (id === 'me') return this.me$

			return this.communityService.getCommunities(id)
		})
	)

	onSubscribe(community_id: any) {
		if (this.isSubscribed) {
			this.leaveCommunity(community_id)
		} else {
			this.joinCommunity(community_id)
		}
		// this.buttonText =
		// 	this.buttonText === 'Подписаться' ? 'Отписаться' : 'Подписаться'
		// this.iconName =
		// 	this.iconName === 'public/assets/svg/subscribe.svg'
		// 		? 'public/assets/svg/unsubscribe.svg'
		// 		: 'public/assets/svg/subscribe.svg'
	}

	joinCommunity(community_id: number) {
		this.http
			.post(
				`${this.baseApiUrl}community/${community_id}/join`,
				this.communities
			)
			.subscribe(() => {
				this.isSubscribed = true
				this.buttonText = 'Отписаться'
			})
	}

	leaveCommunity(community_id: number) {
		this.http
			.post(
				`${this.baseApiUrl}community/${community_id}/join`,
				this.communities
			)
			.subscribe(() => {
				this.isSubscribed = false
				this.buttonText = 'Подписаться'
			})
	}
}
