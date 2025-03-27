import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component'
import { ActivatedRoute, Router } from '@angular/router'
import { filter, of, switchMap } from 'rxjs'
import { AsyncPipe } from '@angular/common'
import { ChatWorkspaceMessagesWrapperComponent } from './chat-workspace-messages-wrapper/chat-workspace-messages-wrapper.component'

import { ChatService } from 'libs/data-access/src/lib/chats'
import { ProfileService } from '@tt/data-access'

@Component({
	selector: 'app-chat-workspace',
	standalone: true,
	imports: [
		ChatWorkspaceHeaderComponent,
		ChatWorkspaceMessagesWrapperComponent,
		AsyncPipe
	],
	templateUrl: './chat-workspace.component.html',
	styleUrl: './chat-workspace.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceComponent {
	route = inject(ActivatedRoute)
	router = inject(Router)
	chatService = inject(ChatService)
	me = inject(ProfileService)

	activeChat$ = this.route.params.pipe(
		switchMap(({ id }) => {
			if (id === 'new') {
				return this.route.queryParams.pipe(
					filter(({ userId }) => userId),
					switchMap(({ userId }) => {
						return this.chatService.createChat(userId).pipe(
							switchMap((chat) => {
								this.router.navigate(['chats', chat.id])
								return of(null)
							})
						)
					})
				)
			}

			return this.chatService.getChatById(id)
		})
	)
}
