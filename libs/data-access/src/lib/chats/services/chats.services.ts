import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable, tap } from 'rxjs'
import { ChatWSService } from '../interfaces/chat-ws-service.interface'
import { ChatWSMessage } from '../interfaces/chat-ws-message.interface'
import { isNewMessage } from '../interfaces/type-guards'
import { ChatWSRxjsService } from '../interfaces/chat-ws-rxjs.service'
import { DateTime } from 'luxon'
import { AuthService } from '../../auth'
import { ProfileService } from '../../profile'
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface'

@Injectable({
	providedIn: 'root'
})
export class ChatService {
	http = inject(HttpClient)
	#authService = inject(AuthService)
	me = inject(ProfileService).me

	wsAdapter: ChatWSService = new ChatWSRxjsService()
	activeChatMessages = signal<Message[]>([])

	groupedActiveChatMessages = signal<[string, Message[]][]>([])

	baseApiUrl = 'https://icherniakov.ru/yt-course/'
	chatsUrl = `${this.baseApiUrl}chat/`
	messageUrl = `${this.baseApiUrl}message/`

	connectWs() {
		return this.wsAdapter.connect({
			url: `${this.baseApiUrl}chat/ws`,
			token: this.#authService.token ?? '',
			handleMessage: this.handleWSMessage
		}) as Observable<ChatWSMessage>
	}

	handleWSMessage = (message: ChatWSMessage) => {
		if (!('action' in message)) return

		if (isNewMessage(message)) {
			const newMessage: Message = {
				id: message.data.id,
				userFromId: message.data.author,
				personalChatId: message.data.chat_id,
				text: message.data.message,
				createdAt: message.data.created_at,
				isRead: false,
				isMine: message.data.author === this.me()!.id
			}

			const currentMessages = this.groupedActiveChatMessages()
			const todayGroup = currentMessages.find(([date]) => date === 'Сегодня')

			if (todayGroup) {
				todayGroup[1].push(newMessage)
			} else {
				currentMessages.push(['Сегодня', [newMessage]])
			}

			this.groupedActiveChatMessages.set([...currentMessages])
		}
	}

	createChat(userId: number) {
		return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {})
	}

	getMyChats() {
		return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`)
	}

	getChatById(chatId: number) {
		return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
			map((chat) => {
				const patchedMessages = chat.messages.map((message) => {
					return {
						...message,
						user:
							chat.userFirst.id === message.userFromId
								? chat.userFirst
								: chat.userSecond,
						isMine: message.userFromId === this.me()!.id
					}
				})

				const groupedMessages = this.getGroupedMessages(patchedMessages)
				this.groupedActiveChatMessages.set(groupedMessages)

				return {
					...chat,
					companion:
						chat.userFirst.id === this.me()!.id
							? chat.userSecond
							: chat.userFirst,
					messages: patchedMessages
				}
			})
		)
	}

	sendMessage<Message>(chatId: number, message: string) {
		return this.http.post(
			`${this.messageUrl}send/${chatId}`,
			{},
			{
				params: {
					message
				}
			}
		)
	}

	fetchChats() {
		return this.http
			.get<Message[]>(`${this.baseApiUrl}chat/`)
			.pipe(tap((res) => this.activeChatMessages.set(res)))
	}

	getGroupedMessages(messages: Message[]) {
		const mapMessages = new Map<string, Message[]>()

		const dateToday = DateTime.now().startOf('day')
		const dateYesterday = dateToday.minus({ days: 1 })

		messages.forEach((message: Message) => {
			const messageDate = DateTime.fromISO(message.createdAt, { zone: 'utc' })
				.setZone(DateTime.local().zone)
				.startOf('day')

			let dateLabel: string
			if (messageDate.equals(dateToday)) {
				dateLabel = 'Сегодня'
			} else if (messageDate.equals(dateYesterday)) {
				dateLabel = 'Вчера'
			} else {
				dateLabel = messageDate.toFormat('dd/MM/yy')
			}

			if (!mapMessages.has(dateLabel)) {
				mapMessages.set(dateLabel, [])
			}
			mapMessages.get(dateLabel)?.push(message)
		})

		return Array.from(mapMessages.entries())
	}
}
