import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ChatsListComponent } from '../chats-list/chats-list.component'

import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ChatService } from 'libs/data-access/src/lib/chats'

@Component({
	selector: 'app-chats',
	standalone: true,
	imports: [RouterOutlet, ChatsListComponent],
	templateUrl: './chats.component.html',
	styleUrl: './chats.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsPageComponent {
	#chatService = inject(ChatService)

	constructor() {
		this.#chatService.connectWs().pipe(takeUntilDestroyed()).subscribe()
	}
}
