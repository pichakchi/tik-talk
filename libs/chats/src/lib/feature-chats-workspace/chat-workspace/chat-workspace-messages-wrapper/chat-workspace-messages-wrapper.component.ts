import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	input,
	Renderer2
} from '@angular/core'
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component'
import {
	debounceTime,
	firstValueFrom,
	fromEvent,
	startWith,
	switchMap,
	tap,
	timer
} from 'rxjs'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router'
import { NgForOf } from '@angular/common'

import { PostService } from '@tt/posts'
import { MessageInputComponent } from '../../../ui/index';
import { Chat, ChatService } from 'libs/data-access/src/lib/chats'

@Component({
	selector: 'app-chat-workspace-messages-wrapper',
	standalone: true,
	imports: [ChatWorkspaceMessageComponent, MessageInputComponent, NgForOf],
	templateUrl: './chat-workspace-messages-wrapper.component.html',
	styleUrl: './chat-workspace-messages-wrapper.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessagesWrapperComponent {
	chatsService = inject(ChatService)
	chatsElement = inject(ElementRef)
	chatsR2 = inject(Renderer2)
	route = inject(ActivatedRoute)
	chatService = inject(ChatService)

	chat = input.required<Chat>()
	getNewGroupedMessages = this.chatsService.getGroupedMessages

	messages = this.chatsService.activeChatMessages

	async onSendMessage(messageText: string) {
		this.chatsService.wsAdapter.sendMessage(messageText, this.chat().id)
		// await firstValueFrom(
		// 	this.chatsService.sendMessage(this.chat().id, messageText)
		// )

		await firstValueFrom(this.chatsService.getChatById(this.chat().id))
	}

	constructor(private postsService: PostService) {
		firstValueFrom(this.chatsService.fetchChats())
	}

	ngAfterViewInit() {
		this.resizeFeed()

		fromEvent(window, 'resize')
			.pipe(debounceTime(200))
			.subscribe(() => {
				this.resizeFeed()
			})
	}

	resizeFeed() {
		const { top } = this.chatsElement.nativeElement.getBoundingClientRect()
		const height = window.innerHeight - top - 24 - 24
		this.chatsR2.setStyle(
			this.chatsElement.nativeElement,
			'height',
			`${height}px`
		)
	}

	activeChat = toSignal(
		this.route.params.pipe(
			switchMap(({ id }) =>
				timer(10000, 10000).pipe(
					startWith(0),
					switchMap(() => this.chatService.getChatById(id))
				)
			),
			tap(({ messages }) => this.messages.set(messages))
		)
	)

	// getGroupedMessages() {
	// 	const arrayMessages = this.messages()
	// 	const mapMessages = new Map<string, Message[]>()
	//
	// 	const dateToday = DateTime.now().startOf('day')
	// 	const dateYesterday = dateToday.minus({ days: 1 })
	//
	// 	arrayMessages.forEach((message) => {
	// 		const messageDate = DateTime.fromISO(message.createdAt, { zone: 'utc' })
	// 			.setZone(DateTime.local().zone)
	// 			.startOf('day')
	//
	// 		let dateName: string
	// 		if (messageDate.equals(dateToday)) {
	// 			dateName = 'Сегодня'
	// 		} else if (messageDate.equals(dateYesterday)) {
	// 			dateName = 'Вчера'
	// 		} else {
	// 			dateName = messageDate.toFormat('dd/MM/yy')
	// 		}
	//
	// 		if (!mapMessages.has(dateName)) {
	// 			mapMessages.set(dateName, [])
	// 		}
	// 		mapMessages.get(dateName)?.push(message)
	// 	})
	//
	// 	return Array.from(mapMessages.entries())
	// }
}
