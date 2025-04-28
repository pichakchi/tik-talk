import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	OnInit
} from '@angular/core'
import { AsyncPipe, NgForOf, NgIf } from '@angular/common'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component'
import { firstValueFrom, Subscription, timer } from 'rxjs'
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui'
import { ChatService, Profile, ProfileService } from '@tt/data-access'
import { ChatWSMessage } from '../../../../data-access/src/lib/chats/interfaces/chat-ws-message.interface'
import { isUnreadMessage } from '../../../../data-access/src/lib/chats/interfaces/type-guards'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [
		SvgIconComponent,
		NgForOf,
		RouterLink,
		SubscriberCardComponent,
		AsyncPipe,
		ImgUrlPipe,
		RouterLinkActive,
		NgIf
	],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
	profileService = inject(ProfileService)
	chatService = inject(ChatService)
	destroyRef = inject(DestroyRef)

	subscribers$ = this.profileService.getSubscribersShortList()
	wsSubscribe!: Subscription
	meProfile: Profile | null = null

	me = this.profileService.me

	unreadMessage = 0

	menuItems = [
		{
			label: 'Моя страница',
			icon: 'home',
			link: 'profile/me'
		},
		{
			label: 'Чаты',
			icon: 'chats',
			link: 'chats'
		},
		{
			label: 'Поиск',
			icon: 'search',
			link: 'search'
		},
		{
			label: 'Сообщества',
			icon: 'communities',
			link: 'communities'
		},
		{
			label: 'Консультация',
			icon: 'experimental',
			link: 'experimental'
		}
	]

	async reconnect() {
		console.log('Reconnecting...')
		await firstValueFrom(this.profileService.getMe())
		await firstValueFrom(timer(2000))
		this.connectWs()
	}

	connectWs() {
		this.wsSubscribe?.unsubscribe()
		this.wsSubscribe = this.chatService
			.connectWs()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((message) => {
				//@ts-ignore
				if (isErrorMessage(message)) {
					console.log('Неверный токен')
					this.reconnect()
				}
			})
	}

	handleWSMessageWow = (message: ChatWSMessage) => {
		if (isUnreadMessage(message)) {
			this.unreadMessage = message.data.count
		}
	}

	ngOnInit() {
		console.log(this.menuItems)
		firstValueFrom(this.profileService.getMe()).then((profile) => {
			this.meProfile = profile
		})

		this.chatService.connectWs().subscribe((message: ChatWSMessage) => {
			this.handleWSMessageWow(message)
		})
	}
}
